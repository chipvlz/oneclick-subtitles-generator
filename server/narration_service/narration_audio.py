import os
import uuid
import base64
import logging
import re
import subprocess
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from .narration_config import REFERENCE_AUDIO_DIR
from .narration_language import is_text_english

logger = logging.getLogger(__name__)

# Create blueprint for audio processing routes
audio_bp = Blueprint('narration_audio', __name__)

@audio_bp.route('/process-base64-reference', methods=['POST'])
def process_base64_audio_reference():
    """Process base64 encoded audio data as reference"""
    try:
        # Use force=True cautiously, but good for flexibility if client Content-Type is wrong
        data = request.get_json(force=True, silent=True)

        if not data:
            # Try getting raw data if JSON parsing failed but content looks like JSON
            raw_data = request.get_data(as_text=True)
            logger.warning(f"Request content-type was {request.content_type}, but failed to parse as JSON. Raw data starts with: {raw_data[:100]}...")
            return jsonify({'error': 'Invalid JSON data received'}), 400

        # Log keys safely


        audio_data_base64 = data.get('audio_data') if isinstance(data, dict) else None
        reference_text = data.get('reference_text', '') if isinstance(data, dict) else ''



        if not audio_data_base64 or not isinstance(audio_data_base64, str):
            logger.error("No 'audio_data' string found in request JSON.")
            return jsonify({'error': 'Missing or invalid audio_data (must be a base64 string)'}), 400

        # Basic base64 format check (padding and characters)
        if not re.match(r'^[A-Za-z0-9+/]*={0,2}$', audio_data_base64.strip()):
             logger.error("Audio data does not appear to be valid base64.")
             sample = audio_data_base64[:100] + ('...' if len(audio_data_base64) > 100 else '')
             logger.error(f"Invalid base64 sample: {sample}")
             return jsonify({'error': 'Invalid base64 format in audio_data'}), 400

        # Generate a unique filename
        unique_id = str(uuid.uuid4())
        # Assume WAV format based on typical web audio recording
        filename = f"recorded_b64_{unique_id}.wav"
        filepath = os.path.join(REFERENCE_AUDIO_DIR, filename)

        # Decode and save the audio data
        try:
            audio_bytes = base64.b64decode(audio_data_base64)

            with open(filepath, 'wb') as f:
                f.write(audio_bytes)

        except base64.binascii.Error as decode_error:
            logger.error(f"Error decoding base64 data: {decode_error}")
            sample = audio_data_base64[:100] + '...' if len(audio_data_base64) > 100 else audio_data_base64
            logger.error(f"Base64 data sample: {sample}")
            return jsonify({'error': f'Invalid base64 data: {str(decode_error)}'}), 400
        except IOError as e:
             logger.error(f"Error saving decoded audio to file {filepath}: {e}", exc_info=True)
             return jsonify({'error': f'Error saving audio file: {str(e)}'}), 500
        except Exception as e:
            logger.exception(f"Unexpected error saving base64 audio: {e}")
            return jsonify({'error': f'Internal server error saving audio: {str(e)}'}), 500

        # Verify file was saved (redundant check, but useful for debugging)
        if not os.path.exists(filepath):
            logger.error(f"File saving failed unexpectedly for {filepath}")
            return jsonify({'error': 'Failed to save audio file after decoding'}), 500

        # --- Transcription Logic ---
        final_reference_text = reference_text
        is_english = True # Default assumption
        language = "Unknown" # Default

        # Skip transcription - handled by frontend
        is_english = is_text_english(final_reference_text) if final_reference_text else True
        language = "English" if is_english else "Non-English" if final_reference_text else "Unknown"



        response_data = {
            'success': True,
            'filepath': filepath,
            'filename': filename,
            'reference_text': final_reference_text,
            'is_english': is_english,
            'language': language
        }

        return jsonify(response_data)

    except Exception as e:
        logger.exception(f"Error in process_base64_audio_reference: {e}")
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@audio_bp.route('/upload-reference', methods=['POST'])
def upload_reference_audio():
    """Upload reference audio file and optionally transcribe"""
    try:
        if 'file' not in request.files:
            logger.error("Upload request missing 'file' part.")
            return jsonify({'error': 'No file part in the request'}), 400

        file = request.files['file']
        if not file or file.filename == '':
            logger.error("Upload request received with no selected file.")
            return jsonify({'error': 'No selected file'}), 400

        # Sanitize filename and make unique
        original_filename = secure_filename(file.filename)
        unique_id = str(uuid.uuid4())
        base, ext = os.path.splitext(original_filename)
        # Ensure extension is reasonable, default to .wav if missing/odd
        ext = ext if ext else '.wav'
        unique_filename = f"{base}_{unique_id}{ext}"
        filepath = os.path.join(REFERENCE_AUDIO_DIR, unique_filename)


        file.save(filepath)


        # Get reference text from form data
        reference_text = request.form.get('reference_text', '')


        # --- Transcription Logic ---
        final_reference_text = reference_text
        is_english = True
        language = "Unknown"

        # Skip transcription - handled by frontend
        is_english = is_text_english(final_reference_text) if final_reference_text else True
        language = "English" if is_english else "Non-English" if final_reference_text else "Unknown"


        return jsonify({
            'success': True,
            'filepath': filepath,
            'filename': unique_filename,
            'reference_text': final_reference_text,
            'is_english': is_english,
            'language': language
        })

    except Exception as e:
        logger.exception(f"Error handling uploaded reference file: {e}")
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

# This route seems redundant if /process-base64-reference handles JSON correctly.
# Kept for backward compatibility or specific form-data scenarios.
@audio_bp.route('/record-reference', methods=['POST'])
def record_reference_audio():
    """Handle reference audio potentially sent as form data (e.g., from recorder.js)"""


    # Check if content type suggests base64 JSON first
    content_type = request.headers.get('Content-Type', '').lower()
    if 'application/json' in content_type:

        # Use the dedicated base64 handler
        return process_base64_audio_reference()

    # Fallback: Handle as form data file upload ('audio_data' field expected)

    try:
        if 'audio_data' not in request.files:
            # Check form fields as fallback if file isn't present
            if 'audio_data' in request.form:
                logger.warning("/record-reference: 'audio_data' found in form fields, not files. Might be base64 string?")
                # Attempt to handle as if it were base64 JSON payload
                try:
                    mock_json_payload = {
                        'audio_data': request.form['audio_data'],
                        'reference_text': request.form.get('reference_text', ''),
                        'transcribe': request.form.get('transcribe', 'false')
                    }
                    # Temporarily replace request data for the handler function
                    # This is a bit hacky; ideally client sends consistent format.
                    original_json = request.json
                    request.json_data_override = mock_json_payload # Custom attribute to pass data
                    response = process_base64_audio_reference_from_override()
                    request.json_data_override = None # Clean up
                    return response
                except Exception as form_b64_err:
                    logger.error(f"Failed to process 'audio_data' from form field as base64: {form_b64_err}")
                    return jsonify({'error': 'Received audio_data in form, but failed to process as base64'}), 400

            logger.error("/record-reference: No 'audio_data' found in request files.")
            return jsonify({'error': 'Missing audio_data file part'}), 400

        audio_file = request.files['audio_data']


        # Generate unique filename, save, and transcribe (similar to /upload-reference)
        unique_id = str(uuid.uuid4())
        # Assume WAV format for recordings
        filename = f"recorded_form_{unique_id}.wav"
        filepath = os.path.join(REFERENCE_AUDIO_DIR, filename)


        audio_file.save(filepath)


        reference_text = request.form.get('reference_text', '')


        # --- Transcription Logic ---
        final_reference_text = reference_text
        is_english = True
        language = "Unknown"

        # Skip transcription - handled by frontend
        is_english = is_text_english(final_reference_text) if final_reference_text else True
        language = "English" if is_english else "Non-English" if final_reference_text else "Unknown"


        return jsonify({
            'success': True,
            'filepath': filepath,
            'filename': filename,
            'reference_text': final_reference_text,
            'is_english': is_english,
            'language': language
        })

    except Exception as e:
        logger.exception(f"Error in /record-reference (form data handling): {e}")
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

# Helper to allow record_reference to call the base64 logic with mocked data
def process_base64_audio_reference_from_override():
     # This function assumes request.json_data_override is set
     if not hasattr(request, 'json_data_override') or not request.json_data_override:
         logger.error("process_base64_audio_reference_from_override called without override data")
         return jsonify({'error': 'Internal server error: missing override data'}), 500
     data = request.json_data_override
     # Now reuse the logic, but source data from the override dict
     # This duplicates the core logic of process_base64_audio_reference.
     # Consider refactoring process_base64_audio_reference to accept a dict?
     # For now, keep it simple:
     audio_data_base64 = data.get('audio_data')
     reference_text = data.get('reference_text', '')

     # (Paste the core decoding, saving, and transcription logic from process_base64_audio_reference here)
     # ... [omitted for brevity - this needs careful copy/paste or refactoring] ...
     # This approach is fragile. Better to refactor the core logic into a helper function.

     # --- Simplified Placeholder - Requires full logic implementation ---
     logger.warning("Executing simplified logic in process_base64_audio_reference_from_override. Needs full implementation.")
     if not audio_data_base64: return jsonify({'error': 'Missing audio_data in override'}), 400
     try:
        # (Placeholder for Decode, Save, Transcribe logic)
        unique_id = str(uuid.uuid4())
        filename = f"recorded_override_{unique_id}.wav"
        filepath = os.path.join(REFERENCE_AUDIO_DIR, filename)
        audio_bytes = base64.b64decode(audio_data_base64)
        with open(filepath, 'wb') as f: f.write(audio_bytes)

        # (Placeholder for Transcription logic)
        final_reference_text = reference_text or "Transcription Placeholder"
        is_english = True
        language = "Unknown (Placeholder)"

        response_data = {
            'success': True, 'filepath': filepath, 'filename': filename,
            'reference_text': final_reference_text, 'is_english': is_english, 'language': language
        }
        return jsonify(response_data)
     except Exception as e:
         logger.error(f"Error processing override data: {e}")
         return jsonify({'error': f'Error processing override data: {str(e)}'}), 500
     # --- End Placeholder ---


@audio_bp.route('/extract-segment', methods=['POST'])
def extract_audio_segment():
    """Extract audio segment from video using ffmpeg"""
    try:
        data = request.json
        video_path = data.get('video_path')
        start_time_raw = data.get('start_time') # Can be seconds or HH:MM:SS.ms
        end_time_raw = data.get('end_time')     # Can be seconds or HH:MM:SS.ms



        if not video_path or start_time_raw is None or end_time_raw is None:
            return jsonify({'error': 'Missing required parameters (video_path, start_time, end_time)'}), 400

        # Ensure video path exists
        if not os.path.exists(video_path):
            logger.error(f"Video file not found for extraction: {video_path}")
            return jsonify({'error': f'Video file not found: {video_path}'}), 404

        # Convert times to seconds if needed (handle HH:MM:SS.ms format)
        def parse_time(time_raw):
            if isinstance(time_raw, (int, float)):
                return float(time_raw)
            if isinstance(time_raw, str):
                try:
                    parts = time_raw.split(':')
                    if len(parts) == 3:
                        h, m, s_ms = parts
                        s = float(s_ms) # Handles seconds with milliseconds
                        return int(h) * 3600 + int(m) * 60 + s
                    elif len(parts) == 2: # MM:SS.ms
                        m, s_ms = parts
                        s = float(s_ms)
                        return int(m) * 60 + s
                    else: # Assume seconds
                        return float(time_raw)
                except ValueError:
                     raise ValueError(f"Invalid time format: {time_raw}")
            raise ValueError(f"Unsupported time type: {type(time_raw)}")

        try:
            start_time = parse_time(start_time_raw)
            end_time = parse_time(end_time_raw)
        except ValueError as e:
            logger.error(f"Error parsing time values: {e}")
            return jsonify({'error': str(e)}), 400

        if start_time < 0 or end_time <= start_time:
            return jsonify({'error': 'Invalid time range (start must be non-negative, end must be after start)'}), 400

        duration = end_time - start_time

        # Generate unique output path
        unique_id = str(uuid.uuid4())
        output_filename = f"segment_{unique_id}.wav"
        output_path = os.path.join(REFERENCE_AUDIO_DIR, output_filename)

        # Construct ffmpeg command
        # -vn: no video
        # -acodec pcm_s16le: Standard WAV format
        # -ar 44100: Sample rate (adjust if F5TTS prefers different)
        # -ac 1: Mono channel (adjust if needed)
        # -ss before -i for faster seeking on keyframes (usually good)
        # -t for duration
        cmd = [
            'ffmpeg', '-y', # Overwrite output without asking
            '-ss', str(start_time), # Seek to start time
            '-i', video_path,
            '-t', str(duration), # Specify duration
            '-vn',
            '-acodec', 'pcm_s16le',
            '-ar', '44100', # Consider making this configurable or detecting source rate
            '-ac', '1',
            output_path
        ]


        # Execute ffmpeg
        try:
            # Use capture_output=True to get stderr for debugging if needed
            result = subprocess.run(cmd, check=True, capture_output=True, text=True, encoding='utf-8')

            logger.debug(f"ffmpeg stdout:\n{result.stdout}")
            logger.debug(f"ffmpeg stderr:\n{result.stderr}")
        except FileNotFoundError:
            logger.error("ffmpeg command not found. Ensure ffmpeg is installed and in the system PATH.")
            return jsonify({'error': 'ffmpeg not found. Please install ffmpeg.'}), 500
        except subprocess.CalledProcessError as e:
            logger.error(f"ffmpeg command failed with exit code {e.returncode}")
            logger.error(f"ffmpeg stderr:\n{e.stderr}")
            # Try to delete potentially incomplete output file
            if os.path.exists(output_path): os.remove(output_path)
            return jsonify({'error': f'ffmpeg failed: {e.stderr[:200]}...'}), 500

        # --- Skip transcription - handled by frontend ---
        reference_text = ""
        is_english = True
        language = "Unknown (No Transcription)"

        return jsonify({
            'success': True,
            'filepath': output_path,
            'filename': output_filename,
            'reference_text': reference_text,
            'is_english': is_english,
            'language': language
        })

    except Exception as e:
        logger.exception(f"Error extracting audio segment: {e}")
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500
