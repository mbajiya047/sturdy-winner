document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('sentiment-form');
    const textArea = document.getElementById('text-input');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const loader = submitBtn.querySelector('.loader');
    
    const resultsContainer = document.getElementById('results-container');
    const sentimentBadge = document.getElementById('sentiment-badge');
    const polarityScore = document.getElementById('polarity-score');
    const subjectivityScore = document.getElementById('subjectivity-score');
    const polarityProgress = document.getElementById('polarity-progress');
    const subjectivityProgress = document.getElementById('subjectivity-progress');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const text = textArea.value.trim();
        if (!text) return;

        // UI Loading State
        setLoadingState(true);

        try {
            const response = await fetch('/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text })
            });

            if (!response.ok) throw new Error('Analysis failed');

            const data = await response.json();
            
            // Artificial delay for smooth animation experience
            setTimeout(() => {
                displayResults(data);
                setLoadingState(false);
            }, 600);

        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while analyzing the text.');
            setLoadingState(false);
        }
    });

    function setLoadingState(isLoading) {
        if (isLoading) {
            submitBtn.disabled = true;
            btnText.classList.add('hidden');
            loader.classList.remove('hidden');
            resultsContainer.classList.add('hidden');
            
            // Reset widths for next animation
            polarityProgress.style.width = '0%';
            subjectivityProgress.style.width = '0%';
        } else {
            submitBtn.disabled = false;
            btnText.classList.remove('hidden');
            loader.classList.add('hidden');
        }
    }

    function displayResults(data) {
        const { sentiment, polarity, subjectivity } = data;

        // Show container
        resultsContainer.classList.remove('hidden');

        // Update Badge
        sentimentBadge.textContent = sentiment;
        sentimentBadge.className = 'badge'; // Reset classes
        sentimentBadge.classList.add(sentiment.toLowerCase());

        // Update Text Scores
        polarityScore.textContent = polarity.toFixed(2);
        subjectivityScore.textContent = subjectivity.toFixed(2);

        // Update Progress Bars
        // Polarity: -1 to 1 -> maps to 0% to 100%
        const polarityPercentage = ((polarity + 1) / 2) * 100;
        
        // Subjectivity: 0 to 1 -> maps to 0% to 100%
        const subjectivityPercentage = subjectivity * 100;

        // Set colors based on values
        let polarityColor = 'var(--neutral)';
        if (polarity > 0.05) polarityColor = 'var(--positive)';
        else if (polarity < -0.05) polarityColor = 'var(--negative)';
        
        polarityProgress.style.backgroundColor = polarityColor;
        subjectivityProgress.style.backgroundColor = 'var(--accent)';

        // Animate widths
        setTimeout(() => {
            polarityProgress.style.width = `${polarityPercentage}%`;
            subjectivityProgress.style.width = `${subjectivityPercentage}%`;
        }, 50);
    }
});
