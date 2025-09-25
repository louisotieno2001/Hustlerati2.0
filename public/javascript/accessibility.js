// Accessibility Settings JavaScript

document.addEventListener('DOMContentLoaded', () => {
    const fontSizeDisplay = document.getElementById('font-size-display');
    const sizeButtons = document.querySelectorAll('.size-btn');
    const resetFontSizeBtn = document.querySelector('.reset-btn[data-reset="font-size"]');
    const lineHeightSelect = document.getElementById('line-height-select');
    const letterSpacingSelect = document.getElementById('letter-spacing-select');
    const contrastButtons = document.querySelectorAll('.contrast-btn');
    const colorSchemeButtons = document.querySelectorAll('.color-scheme-btn');
    const reduceMotionToggle = document.getElementById('reduce-motion-toggle');
    const autoplayToggle = document.getElementById('autoplay-toggle');
    const focusButtons = document.querySelectorAll('.focus-btn');
    const skipLinksToggle = document.getElementById('skip-links-toggle');
    const tabHighlightsToggle = document.getElementById('tab-highlights-toggle');
    const readingMaskToggle = document.getElementById('reading-mask-toggle');
    const ttsToggle = document.getElementById('tts-toggle');
    const dyslexiaFontToggle = document.getElementById('dyslexia-font-toggle');
    const altTextToggle = document.getElementById('alt-text-toggle');
    const linkUnderlinesToggle = document.getElementById('link-underlines-toggle');
    const largeClickToggle = document.getElementById('large-click-toggle');
    const saveSettingsBtn = document.getElementById('save-settings');
    const resetAllBtn = document.getElementById('reset-all');
    const previewChangesBtn = document.getElementById('preview-changes');

    // Default settings
    let fontSizePercent = 100;

    // Load saved settings from localStorage
    function loadSettings() {
        const settings = JSON.parse(localStorage.getItem('accessibilitySettings'));
        if (settings) {
            fontSizePercent = settings.fontSizePercent || 100;
            document.documentElement.style.fontSize = fontSizePercent + '%';
            fontSizeDisplay.textContent = fontSizePercent + '%';

            lineHeightSelect.value = settings.lineHeight || '1.5';
            document.documentElement.style.lineHeight = lineHeightSelect.value;

            letterSpacingSelect.value = settings.letterSpacing || 'normal';
            document.documentElement.style.letterSpacing = letterSpacingSelect.value;

            setContrast(settings.contrast || 'normal');
            setColorScheme(settings.colorScheme || 'default');

            reduceMotionToggle.checked = settings.reduceMotion || false;
            setReduceMotion(reduceMotionToggle.checked);

            autoplayToggle.checked = settings.autoplay || true;
            setAutoplay(autoplayToggle.checked);

            setFocus(settings.focus || 'default');

            skipLinksToggle.checked = settings.skipLinks !== false;
            setSkipLinks(skipLinksToggle.checked);

            tabHighlightsToggle.checked = settings.tabHighlights || false;
            setTabHighlights(tabHighlightsToggle.checked);

            readingMaskToggle.checked = settings.readingMask || false;
            setReadingMask(readingMaskToggle.checked);

            ttsToggle.checked = settings.tts || false;
            setTTS(ttsToggle.checked);

            dyslexiaFontToggle.checked = settings.dyslexiaFont || false;
            setDyslexiaFont(dyslexiaFontToggle.checked);

            altTextToggle.checked = settings.altText !== false;
            setAltText(altTextToggle.checked);

            linkUnderlinesToggle.checked = settings.linkUnderlines || false;
            setLinkUnderlines(linkUnderlinesToggle.checked);

            largeClickToggle.checked = settings.largeClick || false;
            setLargeClick(largeClickToggle.checked);
        } else {
            // Set defaults
            document.documentElement.style.fontSize = fontSizePercent + '%';
            fontSizeDisplay.textContent = fontSizePercent + '%';
            document.documentElement.style.lineHeight = '1.5';
            document.documentElement.style.letterSpacing = 'normal';
            setContrast('normal');
            setColorScheme('default');
            setReduceMotion(false);
            setAutoplay(true);
            setFocus('default');
            setSkipLinks(true);
            setTabHighlights(false);
            setReadingMask(false);
            setTTS(false);
            setDyslexiaFont(false);
            setAltText(true);
            setLinkUnderlines(false);
            setLargeClick(false);
        }
    }

    // Save settings to localStorage
    function saveSettings() {
        const settings = {
            fontSizePercent,
            lineHeight: lineHeightSelect.value,
            letterSpacing: letterSpacingSelect.value,
            contrast: getCurrentContrast(),
            colorScheme: getCurrentColorScheme(),
            reduceMotion: reduceMotionToggle.checked,
            autoplay: autoplayToggle.checked,
            focus: getCurrentFocus(),
            skipLinks: skipLinksToggle.checked,
            tabHighlights: tabHighlightsToggle.checked,
            readingMask: readingMaskToggle.checked,
            tts: ttsToggle.checked,
            dyslexiaFont: dyslexiaFontToggle.checked,
            altText: altTextToggle.checked,
            linkUnderlines: linkUnderlinesToggle.checked,
            largeClick: largeClickToggle.checked,
        };
        localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
        alert('Accessibility settings saved.');
    }

    // Reset all settings to defaults
    function resetAll() {
        localStorage.removeItem('accessibilitySettings');
        loadSettings();
        alert('Accessibility settings reset to defaults.');
    }

    // Font size controls
    sizeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.dataset.action === 'increase') {
                if (fontSizePercent < 200) {
                    fontSizePercent += 10;
                }
            } else if (btn.dataset.action === 'decrease') {
                if (fontSizePercent > 50) {
                    fontSizePercent -= 10;
                }
            }
            document.documentElement.style.fontSize = fontSizePercent + '%';
            fontSizeDisplay.textContent = fontSizePercent + '%';
            // Auto-save font size changes
            const settings = JSON.parse(localStorage.getItem('accessibilitySettings') || '{}');
            settings.fontSizePercent = fontSizePercent;
            localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
        });
    });

    resetFontSizeBtn.addEventListener('click', () => {
        fontSizePercent = 100;
        document.documentElement.style.fontSize = fontSizePercent + '%';
        fontSizeDisplay.textContent = fontSizePercent + '%';
        // Auto-save font size reset
        const settings = JSON.parse(localStorage.getItem('accessibilitySettings') || '{}');
        settings.fontSizePercent = fontSizePercent;
        localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
    });

    // Line height control
    lineHeightSelect.addEventListener('change', () => {
        document.documentElement.style.lineHeight = lineHeightSelect.value;
        // Auto-save line height changes
        const settings = JSON.parse(localStorage.getItem('accessibilitySettings') || '{}');
        settings.lineHeight = lineHeightSelect.value;
        localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
    });

    // Letter spacing control
    letterSpacingSelect.addEventListener('change', () => {
        document.documentElement.style.letterSpacing = letterSpacingSelect.value;
        // Auto-save letter spacing changes
        const settings = JSON.parse(localStorage.getItem('accessibilitySettings') || '{}');
        settings.letterSpacing = letterSpacingSelect.value;
        localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
    });

    // Contrast mode
    function setContrast(mode) {
        document.body.classList.remove('contrast-normal', 'contrast-high', 'dark-theme');
        if (mode === 'high') {
            document.body.classList.add('contrast-high');
        } else if (mode === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.add('contrast-normal');
        }
        contrastButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.contrast === mode);
        });
    }

    function getCurrentContrast() {
        const activeBtn = document.querySelector('.contrast-btn.active');
        return activeBtn ? activeBtn.dataset.contrast : 'normal';
    }

    contrastButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            setContrast(btn.dataset.contrast);
            // Auto-save contrast changes
            const settings = JSON.parse(localStorage.getItem('accessibilitySettings') || '{}');
            settings.contrast = btn.dataset.contrast;
            localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
        });
    });

    // Color scheme
    function setColorScheme(scheme) {
        document.body.classList.remove('scheme-default', 'scheme-deuteranopia', 'scheme-tritanopia', 'scheme-monochrome');
        document.body.classList.add('scheme-' + scheme);
        colorSchemeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.scheme === scheme);
        });
    }

    function getCurrentColorScheme() {
        const activeBtn = document.querySelector('.color-scheme-btn.active');
        return activeBtn ? activeBtn.dataset.scheme : 'default';
    }

    colorSchemeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            setColorScheme(btn.dataset.scheme);
            // Auto-save color scheme changes
            const settings = JSON.parse(localStorage.getItem('accessibilitySettings') || '{}');
            settings.colorScheme = btn.dataset.scheme;
            localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
        });
    });

    // Reduce motion
    function setReduceMotion(enabled) {
        if (enabled) {
            document.body.classList.add('reduce-motion');
        } else {
            document.body.classList.remove('reduce-motion');
        }
    }

    reduceMotionToggle.addEventListener('change', () => {
        setReduceMotion(reduceMotionToggle.checked);
        // Auto-save reduce motion changes
        const settings = JSON.parse(localStorage.getItem('accessibilitySettings') || '{}');
        settings.reduceMotion = reduceMotionToggle.checked;
        localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
    });

    // Autoplay media
    function setAutoplay(enabled) {
        // Implementation depends on site media, placeholder here
        // Could pause/play videos or animations
    }

    autoplayToggle.addEventListener('change', () => {
        setAutoplay(autoplayToggle.checked);
        // Auto-save autoplay changes
        const settings = JSON.parse(localStorage.getItem('accessibilitySettings') || '{}');
        settings.autoplay = autoplayToggle.checked;
        localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
    });

    // Focus indicators
    function setFocus(mode) {
        document.body.classList.remove('focus-default', 'focus-enhanced', 'focus-high-contrast');
        document.body.classList.add('focus-' + mode);
        focusButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.focus === mode);
        });
    }

    function getCurrentFocus() {
        const activeBtn = document.querySelector('.focus-btn.active');
        return activeBtn ? activeBtn.dataset.focus : 'default';
    }

    focusButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            setFocus(btn.dataset.focus);
            // Auto-save focus changes
            const settings = JSON.parse(localStorage.getItem('accessibilitySettings') || '{}');
            settings.focus = btn.dataset.focus;
            localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
        });
    });

    // Skip links
    function setSkipLinks(enabled) {
        // Show or hide skip links, implementation depends on site structure
        // Placeholder: toggle a class
        if (enabled) {
            document.body.classList.remove('skip-links-hidden');
        } else {
            document.body.classList.add('skip-links-hidden');
        }
    }

    skipLinksToggle.addEventListener('change', () => {
        setSkipLinks(skipLinksToggle.checked);
        // Auto-save skip links changes
        const settings = JSON.parse(localStorage.getItem('accessibilitySettings') || '{}');
        settings.skipLinks = skipLinksToggle.checked;
        localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
    });

    // Tab highlights
    function setTabHighlights(enabled) {
        if (enabled) {
            document.body.classList.add('tab-highlights');
        } else {
            document.body.classList.remove('tab-highlights');
        }
    }

    tabHighlightsToggle.addEventListener('change', () => {
        setTabHighlights(tabHighlightsToggle.checked);
        // Auto-save tab highlights changes
        const settings = JSON.parse(localStorage.getItem('accessibilitySettings') || '{}');
        settings.tabHighlights = tabHighlightsToggle.checked;
        localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
    });

    // Reading mask
    function setReadingMask(enabled) {
        if (enabled) {
            document.body.classList.add('reading-mask');
        } else {
            document.body.classList.remove('reading-mask');
        }
    }

    readingMaskToggle.addEventListener('change', () => {
        setReadingMask(readingMaskToggle.checked);
        // Auto-save reading mask changes
        const settings = JSON.parse(localStorage.getItem('accessibilitySettings') || '{}');
        settings.readingMask = readingMaskToggle.checked;
        localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
    });

    // Text-to-speech
    function setTTS(enabled) {
        // Placeholder for TTS enable/disable
    }

    ttsToggle.addEventListener('change', () => {
        setTTS(ttsToggle.checked);
        // Auto-save TTS changes
        const settings = JSON.parse(localStorage.getItem('accessibilitySettings') || '{}');
        settings.tts = ttsToggle.checked;
        localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
    });

    // Dyslexia font
    function setDyslexiaFont(enabled) {
        if (enabled) {
            document.body.classList.add('dyslexia-font');
        } else {
            document.body.classList.remove('dyslexia-font');
        }
    }

    dyslexiaFontToggle.addEventListener('change', () => {
        setDyslexiaFont(dyslexiaFontToggle.checked);
        // Auto-save dyslexia font changes
        const settings = JSON.parse(localStorage.getItem('accessibilitySettings') || '{}');
        settings.dyslexiaFont = dyslexiaFontToggle.checked;
        localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
    });

    // Alt text for images
    function setAltText(enabled) {
        // Placeholder: could toggle alt text visibility or aria attributes
    }

    altTextToggle.addEventListener('change', () => {
        setAltText(altTextToggle.checked);
        // Auto-save alt text changes
        const settings = JSON.parse(localStorage.getItem('accessibilitySettings') || '{}');
        settings.altText = altTextToggle.checked;
        localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
    });

    // Link underlines
    function setLinkUnderlines(enabled) {
        if (enabled) {
            document.body.classList.add('link-underlines');
        } else {
            document.body.classList.remove('link-underlines');
        }
    }

    linkUnderlinesToggle.addEventListener('change', () => {
        setLinkUnderlines(linkUnderlinesToggle.checked);
        // Auto-save link underlines changes
        const settings = JSON.parse(localStorage.getItem('accessibilitySettings') || '{}');
        settings.linkUnderlines = linkUnderlinesToggle.checked;
        localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
    });

    // Large click areas
    function setLargeClick(enabled) {
        if (enabled) {
            document.body.classList.add('large-click-areas');
        } else {
            document.body.classList.remove('large-click-areas');
        }
    }

    largeClickToggle.addEventListener('change', () => {
        setLargeClick(largeClickToggle.checked);
        // Auto-save large click areas changes
        const settings = JSON.parse(localStorage.getItem('accessibilitySettings') || '{}');
        settings.largeClick = largeClickToggle.checked;
        localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
    });

    // Save settings button
    saveSettingsBtn.addEventListener('click', () => {
        saveSettings();
    });

    // Reset all button
    resetAllBtn.addEventListener('click', () => {
        resetAll();
    });

    // Preview changes button
    previewChangesBtn.addEventListener('click', () => {
        // Store current settings for restoration
        const currentSettings = {
            fontSizePercent,
            lineHeight: lineHeightSelect.value,
            letterSpacing: letterSpacingSelect.value,
            contrast: getCurrentContrast(),
            colorScheme: getCurrentColorScheme(),
            reduceMotion: reduceMotionToggle.checked,
            autoplay: autoplayToggle.checked,
            focus: getCurrentFocus(),
            skipLinks: skipLinksToggle.checked,
            tabHighlights: tabHighlightsToggle.checked,
            readingMask: readingMaskToggle.checked,
            tts: ttsToggle.checked,
            dyslexiaFont: dyslexiaFontToggle.checked,
            altText: altTextToggle.checked,
            linkUnderlines: linkUnderlinesToggle.checked,
            largeClick: largeClickToggle.checked,
        };

        // Show preview message
        const previewMessage = document.createElement('div');
        previewMessage.id = 'preview-message';
        previewMessage.innerHTML = `
            <div style="position: fixed; top: 20px; right: 20px; background: #4a6bff; color: white; padding: 15px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 10000; max-width: 300px;">
                <p style="margin: 0 0 10px 0; font-weight: bold;">Preview Mode Active</p>
                <p style="margin: 0 0 15px 0; font-size: 0.9rem;">Changes are temporary. Click "Restore" to revert or "Save Settings" to keep them.</p>
                <button id="restore-preview" style="background: white; color: #4a6bff; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-weight: bold;">Restore</button>
            </div>
        `;
        document.body.appendChild(previewMessage);

        // Add restore functionality
        document.getElementById('restore-preview').addEventListener('click', () => {
            // Restore original settings
            fontSizePercent = currentSettings.fontSizePercent;
            document.documentElement.style.fontSize = fontSizePercent + '%';
            fontSizeDisplay.textContent = fontSizePercent + '%';

            lineHeightSelect.value = currentSettings.lineHeight;
            document.documentElement.style.lineHeight = currentSettings.lineHeight;

            letterSpacingSelect.value = currentSettings.letterSpacing;
            document.documentElement.style.letterSpacing = currentSettings.letterSpacing;

            setContrast(currentSettings.contrast);
            setColorScheme(currentSettings.colorScheme);

            reduceMotionToggle.checked = currentSettings.reduceMotion;
            setReduceMotion(currentSettings.reduceMotion);

            autoplayToggle.checked = currentSettings.autoplay;
            setAutoplay(currentSettings.autoplay);

            setFocus(currentSettings.focus);

            skipLinksToggle.checked = currentSettings.skipLinks;
            setSkipLinks(currentSettings.skipLinks);

            tabHighlightsToggle.checked = currentSettings.tabHighlights;
            setTabHighlights(currentSettings.tabHighlights);

            readingMaskToggle.checked = currentSettings.readingMask;
            setReadingMask(currentSettings.readingMask);

            ttsToggle.checked = currentSettings.tts;
            setTTS(currentSettings.tts);

            dyslexiaFontToggle.checked = currentSettings.dyslexiaFont;
            setDyslexiaFont(currentSettings.dyslexiaFont);

            altTextToggle.checked = currentSettings.altText;
            setAltText(currentSettings.altText);

            linkUnderlinesToggle.checked = currentSettings.linkUnderlines;
            setLinkUnderlines(currentSettings.linkUnderlines);

            largeClickToggle.checked = currentSettings.largeClick;
            setLargeClick(currentSettings.largeClick);

            // Remove preview message
            document.body.removeChild(previewMessage);
        });

        // Auto-remove preview message after 30 seconds
        setTimeout(() => {
            if (document.getElementById('preview-message')) {
                document.body.removeChild(previewMessage);
            }
        }, 30000);
    });

    // Initialize
    loadSettings();
});
