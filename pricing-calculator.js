// Pricing Calculator for VetOne.AI

const consultationsInput = document.getElementById('consultations');
const consultationsSlider = document.getElementById('consultations-slider');
const recommendedPlan = document.getElementById('recommended-plan');
const monthlyCost = document.getElementById('monthly-cost');
const timeSaved = document.getElementById('time-saved');
const roi = document.getElementById('roi');

// Pricing data
const plans = {
    starter: {
        name: 'Iniciante',
        price: 0,
        credits: 20
    },
    essential: {
        name: 'Essencial',
        price: 63,
        credits: 60
    },
    professional: {
        name: 'Profissional',
        price: 99,
        credits: 100
    },
    clinic: {
        name: 'Clínica',
        price: null, // custom pricing
        credits: null
    }
};

// Constants for ROI calculation
const TIME_SAVED_PER_CONSULTATION = 15; // minutes
const HOURLY_RATE = 150; // R$ per hour

function calculatePricing(consultations) {
    let plan, cost;

    if (consultations <= 20) {
        plan = plans.starter;
        cost = plan.price;
    } else if (consultations <= 60) {
        plan = plans.essential;
        cost = plan.price;
    } else if (consultations <= 100) {
        plan = plans.professional;
        cost = plan.price;
    } else {
        // Clinic plan - custom pricing
        plan = plans.clinic;
        cost = null; // Contact sales
    }

    return { plan, cost };
}

function calculateROI(consultations) {
    const totalMinutesSaved = consultations * TIME_SAVED_PER_CONSULTATION;
    const totalHoursSaved = totalMinutesSaved / 60;
    const roiValue = totalHoursSaved * HOURLY_RATE;
    return { totalHoursSaved, roiValue };
}

function updateCalculator() {
    const consultations = parseInt(consultationsInput.value) || 0;

    // Sync slider with input
    consultationsSlider.value = consultations;

    // Calculate pricing
    const { plan, cost } = calculatePricing(consultations);

    // Calculate ROI
    const { totalHoursSaved, roiValue } = calculateROI(consultations);

    // Update UI
    recommendedPlan.textContent = plan.name;

    if (cost === null) {
        monthlyCost.textContent = 'Contate-nos';
    } else if (cost === 0) {
        monthlyCost.textContent = 'Grátis';
    } else {
        monthlyCost.textContent = `R$ ${cost.toFixed(2).replace('.', ',')}/mês`;
    }

    timeSaved.textContent = `~${totalHoursSaved.toFixed(1)}h/mês`;

    if (cost === null) {
        roi.textContent = 'Personalizado';
    } else {
        const netROI = roiValue - cost;
        roi.textContent = `R$ ${netROI.toFixed(2).replace('.', ',')}/mês`;
    }
}

// Event listeners
if (consultationsInput && consultationsSlider) {
    consultationsInput.addEventListener('input', updateCalculator);
    consultationsSlider.addEventListener('input', function() {
        consultationsInput.value = this.value;
        updateCalculator();
    });

    // Initial calculation
    updateCalculator();
}
