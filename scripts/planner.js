class TravelPlanner {
  constructor() {
    this.selectedInterests = new Set();
    this.selectedBudget = null;
    this.selectedTravelStyle = 'moderate';
    this.map = null;
    this.currentItinerary = null;
    
    this.init();
  }

  init() {
    this.bindEvents();
    this.initializeBudgetCards();
    this.initializeTravelStyleCards();
    this.initializeInterestTags();
  }

  bindEvents() {
    // Form submission
    const form = document.getElementById('planningForm');
    if (form) {
      form.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }

    // Surprise me button
    const surpriseBtn = document.getElementById('surpriseBtn');
    if (surpriseBtn) {
      surpriseBtn.addEventListener('click', () => this.surpriseMe());
    }
  }

  initializeBudgetCards() {
    const budgetCards = document.querySelectorAll('.budget-card');
    budgetCards.forEach(card => {
      card.addEventListener('click', () => {
        // Remove previous selections
        budgetCards.forEach(c => c.classList.remove('selected'));
        
        // Add selection to clicked card
        card.classList.add('selected');
        
        // Update hidden input
        this.selectedBudget = card.dataset.budget;
        const budgetInput = document.getElementById('budget');
        if (budgetInput) {
          budgetInput.value = this.selectedBudget;
        }
      });
    });
  }

  initializeTravelStyleCards() {
    const styleCards = document.querySelectorAll('.travel-style-card');
    styleCards.forEach(card => {
      card.addEventListener('click', () => {
        // Remove previous selections
        styleCards.forEach(c => c.classList.remove('selected'));
        
        // Add selection to clicked card
        card.classList.add('selected');
        
        // Update selected style
        this.selectedTravelStyle = card.dataset.style;
        const styleInput = document.getElementById('travelStyle');
        if (styleInput) {
          styleInput.value = this.selectedTravelStyle;
        }
      });
    });

    // Select moderate by default
    const moderateCard = document.querySelector('[data-style="moderate"]');
    if (moderateCard) {
      moderateCard.click();
    }
  }

  initializeInterestTags() {
    const interestTags = document.querySelectorAll('.interest-tag');
    interestTags.forEach(tag => {
      tag.addEventListener('click', () => {
        const interest = tag.dataset.interest;
        
        if (this.selectedInterests.has(interest)) {
          // Remove interest
          this.selectedInterests.delete(interest);
          tag.classList.remove('selected');
        } else {
          // Add interest
          this.selectedInterests.add(interest);
          tag.classList.add('selected');
        }
        
        // Update hidden input
        const interestsInput = document.getElementById('interests');
        if (interestsInput) {
          interestsInput.value = Array.from(this.selectedInterests).join(',');
        }
      });
    });
  }

  surpriseMe() {
    // Random destination
    const destinations = [
      'Goa', 'Kerala', 'Rajasthan', 'Himachal Pradesh', 'Mumbai', 'Delhi',
      'Agra', 'Jaipur', 'Shimla', 'Manali', 'Bangalore', 'Chennai'
    ];
    const randomDestination = destinations[Math.floor(Math.random() * destinations.length)];
    document.getElementById('destination').value = randomDestination;

    // Random duration
    const durations = ['3', '4', '5', '7', '10'];
    const randomDuration = durations[Math.floor(Math.random() * durations.length)];
    document.getElementById('days').value = randomDuration;

    // Random budget
    const budgets = ['budget', 'mid-range', 'luxury', 'premium'];
    const randomBudget = budgets[Math.floor(Math.random() * budgets.length)];
    document.querySelector(`[data-budget="${randomBudget}"]`).click();

    // Random travel style
    const styles = ['relaxed', 'moderate', 'action-packed', 'flexible'];
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    document.querySelector(`[data-style="${randomStyle}"]`).click();

    // Random interests (2-4 selections)
    const allInterests = Array.from(document.querySelectorAll('.interest-tag')).map(tag => tag.dataset.interest);
    const numInterests = Math.floor(Math.random() * 3) + 2; // 2-4 interests
    const randomInterests = [];
    
    while (randomInterests.length < numInterests) {
      const randomInterest = allInterests[Math.floor(Math.random() * allInterests.length)];
      if (!randomInterests.includes(randomInterest)) {
        randomInterests.push(randomInterest);
      }
    }

    // Clear current selections
    document.querySelectorAll('.interest-tag.selected').forEach(tag => {
      tag.classList.remove('selected');
    });
    this.selectedInterests.clear();

    // Select random interests
    randomInterests.forEach(interest => {
      const tag = document.querySelector(`[data-interest="${interest}"]`);
      if (tag) {
        tag.click();
      }
    });

    // Submit form automatically
    setTimeout(() => {
      document.getElementById('planningForm').dispatchEvent(new Event('submit'));
    }, 500);
  }

  async handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const planningData = {
      destination: formData.get('destination'),
      days: parseInt(formData.get('days')),
      budget: this.selectedBudget,
      travelStyle: this.selectedTravelStyle,
      groupSize: parseInt(formData.get('groupSize')),
      interests: Array.from(this.selectedInterests)
    };

    // Validate required fields
    if (!planningData.destination || !planningData.days || !planningData.budget) {
      alert('Please fill in all required fields');
      return;
    }

    if (planningData.interests.length === 0) {
      alert('Please select at least one interest');
      return;
    }

    // Show loading state
    this.showLoadingState();

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate itinerary
      const itinerary = await this.generateItinerary(planningData);
      this.displayResults(itinerary, planningData);
      
      // Show map
      this.initializeMap(itinerary);
      
    } catch (error) {
      console.error('Error generating itinerary:', error);
      this.showError('Failed to generate itinerary. Please try again.');
    }
  }

  showLoadingState() {
    document.getElementById('welcomeMessage').classList.add('hidden');
    document.getElementById('resultsContent').classList.add('hidden');
    document.getElementById('loadingState').classList.remove('hidden');
  }

  showError(message) {
    document.getElementById('loadingState').classList.add('hidden');
    document.getElementById('welcomeMessage').classList.remove('hidden');
    alert(message);
  }

  async generateItinerary(planningData) {
    // Mock itinerary generation with realistic Indian data
    const budgetMultipliers = {
      'budget': { min: 800, max: 1500 },
      'mid-range': { min: 1500, max: 3000 },
      'luxury': { min: 3000, max: 6000 },
      'premium': { min: 6000, max: 12000 }
    };

    const activityDatabase = {
      'Mumbai': {
        'culture': ['Gateway of India', 'Chhatrapati Shivaji Terminus', 'Elephanta Caves', 'Dhobi Ghat'],
        'food': ['Mohammed Ali Road Food Street', 'Trishna Restaurant', 'Crawford Market', 'Leopold Cafe'],
        'nature': ['Marine Drive', 'Juhu Beach', 'Hanging Gardens', 'Sanjay Gandhi National Park'],
        'adventure': ['Parasailing at Juhu', 'Mumbai City Tour', 'Ferry to Alibaug', 'Scuba Diving'],
        'art': ['Jehangir Art Gallery', 'National Gallery of Modern Art', 'Kala Ghoda Art District'],
        'shopping': ['Colaba Causeway', 'Linking Road', 'Phoenix Mills', 'Chor Bazaar'],
        'nightlife': ['Toto\'s Garage', 'Trilogy', 'Aer Lounge', 'Hard Rock Cafe'],
        'photography': ['Marine Drive Sunset', 'Dhobi Ghat Laundry', 'Victoria Terminus', 'Bandra-Worli Sea Link'],
        'spiritual': ['Siddhivinayak Temple', 'Haji Ali Dargah', 'Mahalaxmi Temple', 'Global Vipassana Pagoda'],
        'beaches': ['Juhu Beach', 'Chowpatty Beach', 'Versova Beach', 'Aksa Beach'],
        'wellness': ['Yoga by the Sea', 'Spa at Taj', 'Ayurvedic Massage', 'Meditation Center'],
        'local-life': ['Local Train Journey', 'Dabbawalas Tour', 'Slum Tourism', 'Street Food Walk']
      },
      'Delhi': {
        'culture': ['Red Fort', 'India Gate', 'Humayun\'s Tomb', 'Qutub Minar'],
        'food': ['Chandni Chowk', 'Karim\'s Restaurant', 'Pandara Road', 'Khan Market'],
        'nature': ['Lodhi Gardens', 'India Gate Lawns', 'Garden of Five Senses', 'Agrasen ki Baoli'],
        'adventure': ['Hot Air Balloon', 'Heritage Walk', 'Cycling Tour', 'Rock Climbing'],
        'art': ['National Museum', 'Crafts Museum', 'Kiran Nadar Museum', 'Tibet House Museum'],
        'shopping': ['Connaught Place', 'Janpath Market', 'Dilli Haat', 'Karol Bagh'],
        'nightlife': ['Hauz Khas Village', 'Cyber Hub', 'Connaught Place Bars', 'Select City Walk'],
        'photography': ['Lotus Temple', 'Jama Masjid', 'Raj Ghat', 'Akshardham Temple'],
        'spiritual': ['Lotus Temple', 'Akshardham', 'Jama Masjid', 'Gurudwara Bangla Sahib'],
        'beaches': [], // No beaches in Delhi
        'wellness': ['Spa treatments', 'Yoga classes', 'Ayurveda centers', 'Meditation retreats'],
        'local-life': ['Old Delhi Walk', 'Metro Journey', 'Local Markets', 'Street Food Tour']
      },
      'Goa': {
        'culture': ['Old Goa Churches', 'Fort Aguada', 'Basilica of Bom Jesus', 'Se Cathedral'],
        'food': ['Beach Shacks', 'Vindaloo Trail', 'Feni Tasting', 'Spice Plantation'],
        'nature': ['Dudhsagar Falls', 'Spice Plantations', 'Bird Watching', 'Backwater Cruise'],
        'adventure': ['Water Sports', 'Parasailing', 'Jet Skiing', 'Scuba Diving'],
        'art': ['Art Galleries', 'Handicraft Centers', 'Local Artists', 'Cultural Shows'],
        'shopping': ['Anjuna Flea Market', 'Mapusa Market', 'Local Handicrafts', 'Cashew Shopping'],
        'nightlife': ['Beach Parties', 'Tito\'s Lane', 'Club Cabana', 'Silent Parties'],
        'photography': ['Sunset Points', 'Portuguese Architecture', 'Beach Scenes', 'Spice Gardens'],
        'spiritual': ['Churches', 'Temples', 'Meditation Centers', 'Yoga Retreats'],
        'beaches': ['Baga Beach', 'Calangute Beach', 'Arambol Beach', 'Palolem Beach'],
        'wellness': ['Beach Yoga', 'Ayurvedic Spas', 'Wellness Retreats', 'Massage Therapy'],
        'local-life': ['Fishing Village', 'Local Markets', 'Feni Distillery', 'Village Tours']
      }
      // Add more destinations as needed
    };

    const destination = planningData.destination;
    const activities = activityDatabase[destination] || activityDatabase['Mumbai']; // Fallback
    
    // Calculate budget
    const budgetRange = budgetMultipliers[planningData.budget];
    const dailyBudget = Math.floor(Math.random() * (budgetRange.max - budgetRange.min) + budgetRange.min) * planningData.groupSize;
    const totalBudget = dailyBudget * planningData.days;

    // Generate daily itinerary
    const itinerary = {
      destination: destination,
      days: planningData.days,
      budget: planningData.budget,
      totalBudget: totalBudget,
      dailyBudget: dailyBudget,
      groupSize: planningData.groupSize,
      dailyPlans: []
    };

    for (let day = 1; day <= planningData.days; day++) {
      const dayPlan = {
        day: day,
        date: this.getDateForDay(day),
        activities: [],
        totalCost: 0
      };

      // Determine number of activities based on travel style
      let numActivities;
      switch (planningData.travelStyle) {
        case 'relaxed': numActivities = 2 + Math.floor(Math.random() * 2); break;
        case 'moderate': numActivities = 3 + Math.floor(Math.random() * 2); break;
        case 'action-packed': numActivities = 5 + Math.floor(Math.random() * 2); break;
        case 'flexible': numActivities = 3 + Math.floor(Math.random() * 3); break;
        default: numActivities = 3;
      }

      // Generate activities based on interests
      const selectedActivities = new Set();
      let activityCost = 0;

      for (let i = 0; i < numActivities; i++) {
        const availableInterests = planningData.interests.filter(interest => 
          activities[interest] && activities[interest].length > 0
        );
        
        if (availableInterests.length === 0) continue;

        const randomInterest = availableInterests[Math.floor(Math.random() * availableInterests.length)];
        const interestActivities = activities[randomInterest];
        const availableActivitiesForInterest = interestActivities.filter(activity => 
          !selectedActivities.has(activity)
        );
        
        if (availableActivitiesForInterest.length === 0) continue;

        const randomActivity = availableActivitiesForInterest[Math.floor(Math.random() * availableActivitiesForInterest.length)];
        selectedActivities.add(randomActivity);

        // Generate realistic cost based on budget tier
        const cost = this.generateActivityCost(planningData.budget, randomInterest, planningData.groupSize);
        activityCost += cost;

        dayPlan.activities.push({
          name: randomActivity,
          type: randomInterest,
          time: this.generateActivityTime(i),
          duration: '2-3 hours',
          cost: cost,
          description: this.generateActivityDescription(randomActivity, randomInterest)
        });
      }

      dayPlan.totalCost = activityCost;
      itinerary.dailyPlans.push(dayPlan);
    }

    this.currentItinerary = itinerary;
    return itinerary;
  }

  generateActivityCost(budget, activityType, groupSize) {
    const baseCosts = {
      'budget': { min: 200, max: 800 },
      'mid-range': { min: 500, max: 1500 },
      'luxury': { min: 1200, max: 3000 },
      'premium': { min: 2500, max: 6000 }
    };

    const activityMultipliers = {
      'culture': 1.0,
      'food': 0.8,
      'nature': 0.6,
      'adventure': 1.5,
      'art': 0.9,
      'shopping': 1.2,
      'nightlife': 1.3,
      'photography': 0.7,
      'spiritual': 0.5,
      'beaches': 0.4,
      'wellness': 1.8,
      'local-life': 0.6
    };

    const range = baseCosts[budget];
    const multiplier = activityMultipliers[activityType] || 1.0;
    const baseCost = Math.floor(Math.random() * (range.max - range.min) + range.min);
    
    return Math.floor(baseCost * multiplier * groupSize);
  }

  generateActivityTime(index) {
    const times = ['9:00 AM', '11:30 AM', '2:00 PM', '4:30 PM', '7:00 PM', '8:30 PM'];
    return times[Math.min(index, times.length - 1)];
  }

  generateActivityDescription(activity, type) {
    const descriptions = {
      'culture': 'Explore rich heritage and historical significance',
      'food': 'Savor authentic local flavors and culinary traditions',
      'nature': 'Immerse yourself in natural beauty and tranquility',
      'adventure': 'Get your adrenaline pumping with exciting activities',
      'art': 'Discover artistic expressions and creative showcases',
      'shopping': 'Hunt for unique souvenirs and local products',
      'nightlife': 'Experience vibrant evening entertainment',
      'photography': 'Capture stunning visuals and memorable moments',
      'spiritual': 'Find peace and connect with spiritual traditions',
      'beaches': 'Relax on pristine shores and enjoy coastal vibes',
      'wellness': 'Rejuvenate your body and mind',
      'local-life': 'Experience authentic local culture and traditions'
    };

    return descriptions[type] || 'Enjoy a wonderful experience';
  }

  getDateForDay(day) {
    const today = new Date();
    const targetDate = new Date(today.getTime() + (day - 1) * 24 * 60 * 60 * 1000);
    return targetDate.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  displayResults(itinerary, planningData) {
    document.getElementById('loadingState').classList.add('hidden');
    const resultsContent = document.getElementById('resultsContent');
    
    // Calculate budget utilization
    const totalSpent = itinerary.dailyPlans.reduce((sum, day) => sum + day.totalCost, 0);
    const budgetUtilization = Math.round((totalSpent / itinerary.totalBudget) * 100);
    
    const budgetStatus = budgetUtilization <= 100 ? 'within-budget' : 'over-budget';
    const budgetColor = budgetUtilization <= 100 ? 'text-green-600' : 'text-red-600';
    const budgetBg = budgetUtilization <= 100 ? 'bg-green-100' : 'bg-red-100';

    resultsContent.innerHTML = `
      <!-- Trip Summary -->
      <div class="mb-6">
        <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <i data-lucide="map-pin" class="w-5 h-5 mr-2 text-purple-600"></i>
          Your ${itinerary.destination} Adventure
        </h3>
        
        <!-- Budget Summary -->
        <div class="p-4 ${budgetBg} rounded-lg mb-4">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm font-medium text-gray-700">Budget Utilization</span>
            <span class="text-sm ${budgetColor} font-bold">${budgetUtilization}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300" 
                 style="width: ${Math.min(budgetUtilization, 100)}%"></div>
          </div>
          <div class="mt-2 text-xs text-gray-600">
            Total: ₹${totalSpent.toLocaleString('en-IN')} / ₹${itinerary.totalBudget.toLocaleString('en-IN')}
          </div>
        </div>

        <!-- Trip Details -->
        <div class="grid grid-cols-2 gap-3 text-sm">
          <div class="flex items-center">
            <i data-lucide="calendar" class="w-4 h-4 mr-2 text-gray-500"></i>
            <span>${itinerary.days} days</span>
          </div>
          <div class="flex items-center">
            <i data-lucide="users" class="w-4 h-4 mr-2 text-gray-500"></i>
            <span>${itinerary.groupSize} people</span>
          </div>
          <div class="flex items-center">
            <i data-lucide="indian-rupee" class="w-4 h-4 mr-2 text-gray-500"></i>
            <span>₹${Math.round(totalSpent / itinerary.days).toLocaleString('en-IN')}/day</span>
          </div>
          <div class="flex items-center">
            <i data-lucide="tag" class="w-4 h-4 mr-2 text-gray-500"></i>
            <span class="capitalize">${itinerary.budget} tier</span>
          </div>
        </div>
      </div>

      <!-- Daily Itinerary -->
      <div class="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
        ${itinerary.dailyPlans.map(day => `
          <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <h4 class="font-semibold text-gray-900 mb-2 flex items-center justify-between">
              <span>Day ${day.day}</span>
              <span class="text-sm text-green-600 font-medium">₹${day.totalCost.toLocaleString('en-IN')}</span>
            </h4>
            <p class="text-xs text-gray-500 mb-3">${day.date}</p>
            
            <div class="space-y-2">
              ${day.activities.map(activity => `
                <div class="flex justify-between items-start text-sm">
                  <div class="flex-1">
                    <div class="font-medium text-gray-800">${activity.name}</div>
                    <div class="text-xs text-gray-500 flex items-center mt-1">
                      <i data-lucide="clock" class="w-3 h-3 mr-1"></i>
                      ${activity.time} • ${activity.duration}
                    </div>
                    <div class="text-xs text-gray-600 mt-1">${activity.description}</div>
                  </div>
                  <div class="text-xs text-green-600 font-medium ml-2">
                    ₹${activity.cost.toLocaleString('en-IN')}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Action Buttons -->
      <div class="mt-6 space-y-2">
        <button onclick="window.travelPlanner.exportToPDF()" 
                class="w-full inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
          <i data-lucide="download" class="w-4 h-4 mr-2"></i>
          Export as PDF
        </button>
        <button onclick="window.travelPlanner.shareItinerary()" 
                class="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          <i data-lucide="share-2" class="w-4 h-4 mr-2"></i>
          Share Itinerary
        </button>
        <button onclick="window.travelPlanner.saveToAccount()" 
                class="w-full inline-flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
          <i data-lucide="bookmark" class="w-4 h-4 mr-2"></i>
          Save to Account
        </button>
      </div>
    `;

    resultsContent.classList.remove('hidden');
    
    // Reinitialize icons
    lucide.createIcons();
  }

  initializeMap(itinerary) {
    const mapSection = document.getElementById('mapSection');
    mapSection.classList.remove('hidden');

    // Coordinates for major Indian cities
    const cityCoordinates = {
      'Mumbai': [19.0760, 72.8777],
      'Delhi': [28.6139, 77.2090],
      'Goa': [15.2993, 74.1240],
      'Kerala': [10.8505, 76.2711],
      'Rajasthan': [27.0238, 74.2179],
      'Himachal Pradesh': [31.1048, 77.1734],
      'Bangalore': [12.9716, 77.5946],
      'Chennai': [13.0827, 80.2707],
      'Kolkata': [22.5726, 88.3639],
      'Jaipur': [26.9124, 75.7873],
      'Agra': [27.1767, 78.0081],
      'Kochi': [9.9312, 76.2673],
      'Shimla': [31.1048, 77.1734],
      'Manali': [32.2432, 77.1892],
      'Udaipur': [24.5854, 73.7125],
      'Darjeeling': [27.0360, 88.2627]
    };

    const destination = itinerary.destination;
    const coordinates = cityCoordinates[destination] || cityCoordinates['Mumbai'];

    // Initialize map
    if (this.map) {
      this.map.remove();
    }

    this.map = L.map('map').setView(coordinates, 12);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Add main destination marker
    L.marker(coordinates)
      .addTo(this.map)
      .bindPopup(`<b>${destination}</b><br>Your amazing ${itinerary.days}-day adventure!`)
      .openPopup();

    // Add activity markers (simulated locations around the city)
    itinerary.dailyPlans.forEach((day, dayIndex) => {
      day.activities.forEach((activity, activityIndex) => {
        const activityLat = coordinates[0] + (Math.random() - 0.5) * 0.1;
        const activityLng = coordinates[1] + (Math.random() - 0.5) * 0.1;
        
        const marker = L.marker([activityLat, activityLng])
          .addTo(this.map)
          .bindPopup(`
            <b>Day ${day.day}: ${activity.name}</b><br>
            <em>${activity.type}</em><br>
            Time: ${activity.time}<br>
            Cost: ₹${activity.cost.toLocaleString('en-IN')}
          `);
      });
    });
  }

  async exportToPDF() {
    if (!this.currentItinerary) {
      alert('No itinerary to export');
      return;
    }

    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      
      // Set font
      doc.setFont('helvetica');
      
      // Title
      doc.setFontSize(20);
      doc.setTextColor(102, 126, 234);
      doc.text('Localuxe Travel Itinerary', 20, 20);
      
      // Destination and basic info
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text(`${this.currentItinerary.destination} - ${this.currentItinerary.days} Days`, 20, 35);
      
      // Budget summary
      const totalSpent = this.currentItinerary.dailyPlans.reduce((sum, day) => sum + day.totalCost, 0);
      doc.setFontSize(12);
      doc.text(`Budget: ₹${totalSpent.toLocaleString('en-IN')} (${this.currentItinerary.budget} tier)`, 20, 45);
      doc.text(`Group Size: ${this.currentItinerary.groupSize} people`, 20, 52);
      
      let yPosition = 65;
      
      // Daily itinerary
      this.currentItinerary.dailyPlans.forEach((day) => {
        // Check if we need a new page
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        
        // Day header
        doc.setFontSize(14);
        doc.setTextColor(102, 126, 234);
        doc.text(`Day ${day.day} - ${day.date}`, 20, yPosition);
        doc.setTextColor(0, 150, 0);
        doc.text(`₹${day.totalCost.toLocaleString('en-IN')}`, 150, yPosition);
        yPosition += 10;
        
        // Activities
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        day.activities.forEach((activity) => {
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }
          
          doc.text(`• ${activity.time} - ${activity.name}`, 25, yPosition);
          doc.text(`₹${activity.cost.toLocaleString('en-IN')}`, 170, yPosition);
          yPosition += 5;
          
          // Activity description (wrapped)
          const descLines = doc.splitTextToSize(activity.description, 140);
          descLines.forEach((line) => {
            if (yPosition > 270) {
              doc.addPage();
              yPosition = 20;
            }
            doc.setTextColor(100, 100, 100);
            doc.text(line, 30, yPosition);
            yPosition += 4;
          });
          
          yPosition += 3;
          doc.setTextColor(0, 0, 0);
        });
        
        yPosition += 5;
      });
      
      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Generated by Localuxe AI - Page ${i} of ${pageCount}`, 20, 285);
        doc.text(`${new Date().toLocaleDateString('en-IN')}`, 150, 285);
      }
      
      // Save the PDF
      doc.save(`${this.currentItinerary.destination}-${this.currentItinerary.days}days-itinerary.pdf`);
      
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    }
  }

  shareItinerary() {
    if (!this.currentItinerary) {
      alert('No itinerary to share');
      return;
    }

    const shareText = `Check out my ${this.currentItinerary.days}-day trip to ${this.currentItinerary.destination}! 
Total budget: ₹${this.currentItinerary.dailyPlans.reduce((sum, day) => sum + day.totalCost, 0).toLocaleString('en-IN')} 
Planned with Localuxe AI 🇮🇳✈️`;

    if (navigator.share) {
      navigator.share({
        title: `My ${this.currentItinerary.destination} Itinerary`,
        text: shareText,
        url: window.location.href
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Itinerary details copied to clipboard!');
      }).catch(() => {
        alert('Could not copy to clipboard. Please share manually.');
      });
    }
  }

  saveToAccount() {
    if (!this.currentItinerary) {
      alert('No itinerary to save');
      return;
    }

    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('localuxeUser') || 'null');
    if (!user) {
      if (confirm('You need to be logged in to save itineraries. Would you like to login now?')) {
        window.location.href = 'login.html';
      }
      return;
    }

    // Save to localStorage (in a real app, this would be sent to a server)
    const savedItineraries = JSON.parse(localStorage.getItem('localuxeSavedItineraries') || '[]');
    const itineraryToSave = {
      ...this.currentItinerary,
      id: Date.now(),
      savedAt: new Date().toISOString(),
      userId: user.email
    };
    
    savedItineraries.push(itineraryToSave);
    localStorage.setItem('localuxeSavedItineraries', JSON.stringify(savedItineraries));
    
    alert('Itinerary saved to your account!');
  }
}

// Initialize the travel planner
window.travelPlanner = new TravelPlanner();