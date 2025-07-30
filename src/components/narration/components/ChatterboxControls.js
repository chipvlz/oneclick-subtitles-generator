import React from 'react';
import { useTranslation } from 'react-i18next';
import StandardSlider from '../../common/StandardSlider';
import '../../../styles/narration/narrationAdvancedSettingsRedesign.css';

/**
 * Chatterbox Controls component for exaggeration and CFG weight sliders
 * @param {Object} props - Component props
 * @param {number} props.exaggeration - Current exaggeration value (0.25-2.0)
 * @param {Function} props.setExaggeration - Function to set exaggeration
 * @param {number} props.cfgWeight - Current CFG weight value (0.0-1.0)
 * @param {Function} props.setCfgWeight - Function to set CFG weight
 * @param {boolean} props.isGenerating - Whether generation is in progress
 * @returns {JSX.Element} - Rendered component
 */
const ChatterboxControls = ({
  exaggeration,
  setExaggeration,
  cfgWeight,
  setCfgWeight,
  isGenerating
}) => {
  const { t } = useTranslation();

  // Handle slider changes
  const handleExaggerationChange = (e) => {
    const value = parseFloat(e.target.value);
    setExaggeration(value);
    // Save to localStorage for persistence
    localStorage.setItem('chatterbox_exaggeration', value.toString());
  };

  const handleCfgWeightChange = (e) => {
    const value = parseFloat(e.target.value);
    setCfgWeight(value);
    // Save to localStorage for persistence
    localStorage.setItem('chatterbox_cfg_weight', value.toString());
  };

  // Calculate slider fill percentage
  const calculateFillPercentage = (value, min, max) => {
    return ((value - min) / (max - min)) * 100;
  };

  return (
    <div className="chatterbox-controls">
      {/* Exaggeration Slider */}
      <div className="narration-row chatterbox-control-row animated-row">
        <div className="row-label">
          <label htmlFor="chatterbox-exaggeration">{t('narration.exaggeration', 'Emotional Intensity')}:</label>
        </div>
        <div className="row-content">
          <div className="slider-with-value">
            <StandardSlider
              value={exaggeration}
              onChange={(value) => handleExaggerationChange({ target: { value } })}
              min={0.25}
              max={2.0}
              step={0.05}
              orientation="horizontal"
              size="xsmall"
              state={isGenerating ? "disabled" : "enabled"}
              showValueIndicator={false} // Using custom value display
              showIcon={false}
              showStops={false}
              className="chatterbox-exaggeration-slider"
              id="chatterbox-exaggeration"
              ariaLabel={t('narration.exaggeration', 'Emotional Intensity')}
            />
            <div className="slider-value-display">{exaggeration.toFixed(2)}</div>
          </div>
          <div className="setting-description">
            {t('narration.exaggerationDesc', 'Higher values increase emotional expression')}
          </div>
        </div>
      </div>

      {/* CFG Weight Slider */}
      <div className="narration-row chatterbox-control-row animated-row">
        <div className="row-label">
          <label htmlFor="chatterbox-cfg-weight">{t('narration.cfgWeight', 'Pace Control')}:</label>
        </div>
        <div className="row-content">
          <div className="slider-with-value">
            <StandardSlider
              value={cfgWeight}
              onChange={(value) => handleCfgWeightChange({ target: { value } })}
              min={0.0}
              max={1.0}
              step={0.05}
              orientation="Horizontal"
              size="XSmall"
              state={isGenerating ? "Disabled" : "Enabled"}
              showValueIndicator={false} // Using custom value display
              showIcon={false}
              showStops={false}
              className="chatterbox-cfg-weight-slider"
              id="chatterbox-cfg-weight"
              ariaLabel={t('narration.cfgWeight', 'Pace Control')}
            />
            <div className="slider-value-display">{cfgWeight.toFixed(2)}</div>
          </div>
          <div className="setting-description">
            {t('narration.cfgWeightDesc', 'Adjusts generation strength and speaking pace')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatterboxControls;
