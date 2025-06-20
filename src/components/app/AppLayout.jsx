import React, { useEffect, useState } from 'react';
import Header from '../Header';
import InputMethods from '../InputMethods';
import OutputContainer from '../OutputContainer';
import ButtonsContainer from './ButtonsContainer';
import SettingsModal from '../settings/SettingsModal';
import TranslationWarningToast from '../TranslationWarningToast';
import VideoAnalysisModal from '../VideoAnalysisModal';
import TranscriptionRulesEditor from '../TranscriptionRulesEditor';
import BackgroundImageGenerator from '../BackgroundImageGenerator';
import VideoRenderingSection from '../VideoRenderingSection';
import VideoQualityModal from '../VideoQualityModal';
import FloatingScrollbar from '../FloatingScrollbar';
import OnboardingBanner from '../OnboardingBanner';
import { useVideoInfo } from '../../hooks/useVideoInfo';

/**
 * Main application layout component
 */
const AppLayout = ({
  appState,
  appHandlers,
  modalHandlers,
  t
}) => {
  // State for background image generator
  const [showBackgroundGenerator, setShowBackgroundGenerator] = useState(false);
  const [backgroundLyrics, setBackgroundLyrics] = useState('');
  const [backgroundAlbumArt, setBackgroundAlbumArt] = useState('');
  const [backgroundSongName, setBackgroundSongName] = useState('');

  // State for video rendering section
  const [videoRenderingAutoFill, setVideoRenderingAutoFill] = useState(null);
  const [actualVideoUrl, setActualVideoUrl] = useState('');

  // State for video quality modal
  const [showVideoQualityModal, setShowVideoQualityModal] = useState(false);

  // Handler for generating background image
  const handleGenerateBackground = (lyrics, albumArt, songName) => {



    // Set the state variables immediately
    setBackgroundLyrics(lyrics);
    setBackgroundAlbumArt(albumArt);
    setBackgroundSongName(songName || '');

    // Force expand the component
    setShowBackgroundGenerator(true);


    // Scroll to the BackgroundImageGenerator after it's rendered
    setTimeout(() => {
      const backgroundGenerator = document.querySelector('.background-generator-container');
      if (backgroundGenerator) {


        backgroundGenerator.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {

      }

      // Check if the container is still collapsed
      const isStillCollapsed = backgroundGenerator?.classList.contains('collapsed');

    }, 500); // Increased timeout to ensure component is rendered
  };

  const {
    showSettings, setShowSettings,
    activeTab,
    selectedVideo, setSelectedVideo,
    uploadedFile, setUploadedFile,
    apiKeysSet, setApiKeysSet,
    isAppReady,
    isGenerating,
    isDownloading,
    downloadProgress,
    currentDownloadId,
    isRetrying,
    isSrtOnlyMode, setIsSrtOnlyMode,
    showVideoAnalysis, setShowVideoAnalysis,
    videoAnalysisResult, setVideoAnalysisResult,
    segmentsStatus,
    videoSegments,
    showRulesEditor, setShowRulesEditor,
    userProvidedSubtitles,
    useUserProvidedSubtitles,
    transcriptionRules,
    subtitlesData, setSubtitlesData,
    status,
    timeFormat,
    showWaveform,
    useOptimizedPreview,
    optimizeVideos,
    optimizedResolution,
    retryingSegments,
    retrySegment
  } = appState;

  const {
    validateInput,
    handleSrtUpload,
    handleGenerateSubtitles,
    handleRetryGeneration,
    handleCancelDownload,
    handleTabChange,
    saveApiKeys
  } = appHandlers;

  const {
    handleUseRecommendedPreset,
    handleUseDefaultPreset,
    handleEditRules,
    handleSaveRules,
    handleViewRules,
    handleUserSubtitlesAdd,
    handleAbortVideoAnalysis
  } = modalHandlers;

  // Use video info hook to track current video and available versions
  const {
    videoInfo,
    availableVersions,
    getVideoInfoForModal,
    getVideoFileForRendering
  } = useVideoInfo(selectedVideo, uploadedFile, actualVideoUrl);

  // Handler for generating a specific segment
  const handleGenerateSegment = async (segmentIndex, segments) => {
    if (!segments || !segments[segmentIndex]) {
      console.error('No segment found at index', segmentIndex);
      return;
    }

    // Prepare options for segment generation
    const segmentOptions = {};

    // Add user-provided subtitles if available and enabled
    if (useUserProvidedSubtitles && userProvidedSubtitles) {
      segmentOptions.userProvidedSubtitles = userProvidedSubtitles;
    }

    // Use the retrySegment function which will properly combine this segment's results
    // with any previously processed segments
    await retrySegment(segmentIndex, segments, segmentOptions);
  };

  // Handler for retrying a segment with a specific model
  const handleRetryWithModel = async (segmentIndex, modelId, segments) => {
    if (!segments || !segments[segmentIndex]) {
      console.error('No segment found at index', segmentIndex);
      return;
    }

    // Save the current model
    const currentModel = localStorage.getItem('gemini_model');

    // Temporarily set the selected model
    localStorage.setItem('gemini_model', modelId);

    // Prepare options for segment retry
    const segmentOptions = {};

    // Add user-provided subtitles if available and enabled
    if (useUserProvidedSubtitles && userProvidedSubtitles) {
      segmentOptions.userProvidedSubtitles = userProvidedSubtitles;
    }

    try {
      // Use the retrySegment function with the temporarily set model
      await retrySegment(segmentIndex, segments, segmentOptions);
    } finally {
      // Restore the original model
      if (currentModel) {
        localStorage.setItem('gemini_model', currentModel);
      } else {
        localStorage.removeItem('gemini_model');
      }
    }
  };
  // Handler for render video action
  const handleRenderVideo = () => {
    // Check if we have video info and should show quality modal
    if (videoInfo) {
      setShowVideoQualityModal(true);
    } else {
      // Fallback to original behavior if no video info
      proceedWithVideoRendering();
    }
  };

  // Proceed with video rendering (original behavior)
  const proceedWithVideoRendering = (videoFile = null) => {
    // Auto-fill the video rendering section and ensure it's expanded
    setVideoRenderingAutoFill({
      timestamp: Date.now(), // Use timestamp to trigger re-render
      expand: true, // Signal to expand the section
      autoScroll: true, // Also scroll to the section
      videoFile: videoFile // Pass selected video file if any
    });
  };

  // Handler for video quality modal confirmation
  const handleVideoQualityConfirm = async (option, data = {}) => {
    try {
      // Get the appropriate video file based on user selection
      const videoFile = await getVideoFileForRendering(option, data);

      // Close the modal
      setShowVideoQualityModal(false);

      // Proceed with video rendering using the selected video
      proceedWithVideoRendering(videoFile);
    } catch (error) {
      console.error('Error handling video quality selection:', error);
      // Show error to user (you might want to add a toast notification here)
      alert(`Error: ${error.message}`);
    }
  };

  // Handle when video source is removed or added
  useEffect(() => {
    // Check if we have a video URL in localStorage
    const hasVideoUrlInStorage = localStorage.getItem('current_video_url') || localStorage.getItem('current_file_url');

    // If we have subtitles data but no video source, switch to SRT-only mode
    if (!selectedVideo && !uploadedFile && !hasVideoUrlInStorage && subtitlesData) {
      setIsSrtOnlyMode(true);
    }
    // If we have a video source, switch to normal mode
    else if ((selectedVideo || uploadedFile || hasVideoUrlInStorage) && subtitlesData && isSrtOnlyMode) {
      setIsSrtOnlyMode(false);
    }
  }, [selectedVideo, uploadedFile, subtitlesData, isSrtOnlyMode, setIsSrtOnlyMode]);

  return (
    <>
      <Header
        onSettingsClick={() => setShowSettings(true)}
      />

      {isAppReady && (
        <main className="app-main">
          <InputMethods
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            selectedVideo={selectedVideo}
            setSelectedVideo={setSelectedVideo}
            uploadedFile={uploadedFile}
            setUploadedFile={setUploadedFile}
            apiKeysSet={apiKeysSet}
            isSrtOnlyMode={isSrtOnlyMode}
            setIsSrtOnlyMode={setIsSrtOnlyMode}
          />

          {/* Consistent layout container for buttons and output */}
          <div className="content-layout-container">
            <ButtonsContainer
              handleSrtUpload={handleSrtUpload}
              handleGenerateSubtitles={handleGenerateSubtitles}
              handleRetryGeneration={handleRetryGeneration}
              handleCancelDownload={handleCancelDownload}
              handleUserSubtitlesAdd={handleUserSubtitlesAdd}
              handleAbortVideoAnalysis={handleAbortVideoAnalysis}
              validateInput={validateInput}
              isGenerating={isGenerating}
              isDownloading={isDownloading}
              downloadProgress={downloadProgress}
              currentDownloadId={currentDownloadId}
              isRetrying={isRetrying}
              setIsRetrying={appState.setIsRetrying}
              retryingSegments={retryingSegments}
              segmentsStatus={segmentsStatus}
              subtitlesData={subtitlesData}
              status={status}
              userProvidedSubtitles={userProvidedSubtitles}
              selectedVideo={selectedVideo}
              uploadedFile={uploadedFile}
              isSrtOnlyMode={isSrtOnlyMode}
              t={t}
              onGenerateBackground={handleGenerateBackground}
            />

            <OutputContainer
              status={status}
              subtitlesData={subtitlesData}
              setSubtitlesData={setSubtitlesData}
              selectedVideo={selectedVideo}
              uploadedFile={uploadedFile}
              isGenerating={isGenerating}
              segmentsStatus={segmentsStatus}
              activeTab={activeTab}
              onRetrySegment={retrySegment}
              onRetryWithModel={handleRetryWithModel}
              onGenerateSegment={handleGenerateSegment}
              videoSegments={videoSegments}
              retryingSegments={retryingSegments}
              timeFormat={timeFormat}
              showWaveform={showWaveform}
              useOptimizedPreview={useOptimizedPreview}
              isSrtOnlyMode={isSrtOnlyMode}
              onViewRules={handleViewRules}
              userProvidedSubtitles={userProvidedSubtitles}
              onUserSubtitlesAdd={(text) => {
                handleUserSubtitlesAdd(text);
                // Close background generator if open
                setShowBackgroundGenerator(false);
              }}
              onGenerateBackground={handleGenerateBackground}
              onRenderVideo={handleRenderVideo}
              onActualVideoUrlChange={setActualVideoUrl}
            />
          </div>

          {/* Video Rendering Section - Above Background Generator */}
          <VideoRenderingSection
            selectedVideo={selectedVideo}
            uploadedFile={uploadedFile}
            actualVideoUrl={actualVideoUrl}
            subtitlesData={subtitlesData}
            translatedSubtitles={window.translatedSubtitles}
            narrationResults={window.originalNarrations || window.translatedNarrations}
            autoFillData={videoRenderingAutoFill}
          />

          {/* Background Image Generator - Always visible but collapsed at page start */}
          <BackgroundImageGenerator
            lyrics={backgroundLyrics}
            albumArt={backgroundAlbumArt}
            songName={backgroundSongName}
            isExpanded={showBackgroundGenerator}
            onExpandChange={(expanded) => setShowBackgroundGenerator(expanded)}
          />
        </main>
      )}

      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          onSave={saveApiKeys}
          apiKeysSet={apiKeysSet}
          setApiKeysSet={setApiKeysSet}
          optimizeVideos={optimizeVideos}
          optimizedResolution={optimizedResolution}
          useOptimizedPreview={useOptimizedPreview}
        />
      )}

      {/* Video Analysis Modal */}
      {/* Check if we should show the modal */}
      {((showVideoAnalysis || localStorage.getItem('show_video_analysis') === 'true') &&
        (videoAnalysisResult || localStorage.getItem('video_analysis_result'))) && (
        <VideoAnalysisModal
          isOpen={true}
          onClose={() => {
            // Clear localStorage flags
            localStorage.removeItem('show_video_analysis');
            localStorage.removeItem('video_analysis_timestamp');
            localStorage.removeItem('video_analysis_result');
            setShowVideoAnalysis(false);
            setVideoAnalysisResult(null);
            // Use default preset if user closes the modal
            handleUseDefaultPreset();
          }}
          analysisResult={videoAnalysisResult}
          onUsePreset={handleUseRecommendedPreset}
          onUseDefaultPreset={handleUseDefaultPreset}
          onEditRules={handleEditRules}
        />
      )}

      {/* Transcription Rules Editor */}
      {showRulesEditor && transcriptionRules && (
        <TranscriptionRulesEditor
          isOpen={showRulesEditor}
          onClose={(action) => {
            setShowRulesEditor(false);
            // Reopen the video analysis modal only if it was previously open
            if ((action === 'cancel' || action === 'save') && videoAnalysisResult) {
              setShowVideoAnalysis(true);
              // Set localStorage flag to ensure modal stays open
              localStorage.setItem('show_video_analysis', 'true');
              // If we have a video analysis result, make sure it's available
              localStorage.setItem('video_analysis_result', JSON.stringify(videoAnalysisResult));
              localStorage.setItem('video_analysis_timestamp', Date.now().toString());
            }
          }}
          initialRules={transcriptionRules}
          onSave={handleSaveRules}
          onChangePrompt={(preset) => {

            // If we're using a recommended preset from video analysis, update the session storage
            if (sessionStorage.getItem('current_session_preset_id')) {
              sessionStorage.setItem('current_session_preset_id', preset.id);
              sessionStorage.setItem('current_session_prompt', preset.prompt);
            } else {
              // Otherwise update the localStorage
              localStorage.setItem('transcription_prompt', preset.prompt);
            }
          }}
        />
      )}

      {/* Video Quality Modal */}
      {showVideoQualityModal && (
        <VideoQualityModal
          isOpen={showVideoQualityModal}
          onClose={() => setShowVideoQualityModal(false)}
          onConfirm={handleVideoQualityConfirm}
          videoInfo={getVideoInfoForModal()?.videoInfo || videoInfo}
          availableVersions={availableVersions}
        />
      )}

      {/* Toast for translation warnings */}
      <TranslationWarningToast />

      {/* Floating scrollbar component */}
      <FloatingScrollbar />
    </>
  );
};

export default AppLayout;
