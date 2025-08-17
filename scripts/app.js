class LocaluxeApp {
  constructor() {
    this.selectedBudget = 37500; // Default mid-range
    this.selectedInterests = [];
    this.selectedTravelStyle = 'moderate'; // Default
  }

  initializeApp() {
    this.initializeForm();
    this.initializeSurpriseButton();
    this.initializeResultsActions();
  }

  initializeForm() {
    const form = document.getElementById('itinerary-form');
    if (!form) return;

    form.addEventListener('submit', (e) => this.submitForm(e));

    // Budget selection
    document.querySelectorAll('.budget-option').forEach(button => {
      button.addEventListener('click', () => {
        document.querySelectorAll('.budget-option').forEach(btn => {
          btn.classList.remove('border-primary-500', 'bg-primary-50', 'text-primary-700');
          btn.classList.add('border-gray-200', 'text-gray-700');
        });
        button.classList.remove('border-gray-200', 'text-gray-700');
        button.classList.add('border-primary-500', 'bg-primary-50', 'text-primary-700');
        this.selectedBudget = parseInt(button.dataset.budget);
      });
    });

    // Travel style selection
    document.querySelectorAll('.travel-style-option').forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all travel style buttons
        document.querySelectorAll('.travel-style-option').forEach(btn => {
          btn.classList.remove('border-blue-500', 'bg-blue-50', 'text-blue-700');
          btn.classList.add('border-gray-200', 'text-gray-700');
        });
        
        // Add active class to clicked button
        button.classList.remove('border-gray-200', 'text-gray-700');
        button.classList.add('border-blue-500', 'bg-blue-50', 'text-blue-700');
        
        // Store selected travel style
        this.selectedTravelStyle = button.dataset.style;
      });
    });

    // Interest tags selection
    document.querySelectorAll('.interest-tag').forEach(tag => {
      tag.addEventListener('click', () => {
        tag.classList.toggle('border-primary-500');
        tag.classList.toggle('text-primary-600');
        tag.classList.toggle('bg-primary-50');
        this.selectedInterests = Array.from(document.querySelectorAll('.interest-tag.border-primary-500'))
          .map(t => t.dataset.interest);
      });
    });

    // Days input handling
    document.querySelector('[data-id="days-select"]').addEventListener('change', (e) => {
      document.querySelector('[data-id="days-input"]').value = e.target.value;
    });
  }

  initializeSurpriseButton() {
    const surpriseBtn = document.getElementById('surprise-btn');
    if (!surpriseBtn) return;
    
    surpriseBtn.addEventListener('click', () => this.surpriseMe());
  }

  initializeResultsActions() {
    // New search button
    const newSearchBtn = document.getElementById('new-search-btn');
    if (newSearchBtn) {
      newSearchBtn.addEventListener('click', () => {
        document.getElementById('results-section').classList.add('hidden');
        document.querySelector('section').scrollIntoView({ behavior: 'smooth' });
      });
    }
  }

  submitForm(e) {
    e.preventDefault();
    
    const city = document.querySelector('[data-id="city-input"]').value.trim();
    const days = document.querySelector('[data-id="days-select"]').value || document.querySelector('[data-id="days-input"]').value;
    const budget = this.selectedBudget;
    const travelStyle = this.selectedTravelStyle || 'moderate';
    const interests = this.selectedInterests;
    const groupSize = document.querySelector('[data-id="group-size-select"]').value || 2;

    if (!city) {
      alert('Please enter a city.');
      return;
    }

    if (!days) {
      alert('Please select number of days.');
      return;
    }
    
    this.showLoading();
    
    // Simulate AI processing
    setTimeout(() => {
      const itinerary = this.generateItinerary(city, days, budget, interests, travelStyle, groupSize);
      this.displayItinerary(itinerary);
      this.hideLoading();
    }, 2000);
  }

  surpriseMe() {
    this.showLoading();
    
    setTimeout(() => {
      const cities = ['Mumbai', 'Delhi', 'Goa', 'Bengaluru', 'Chennai', 'Kolkata', 'Jaipur', 'Udaipur', 'Varanasi', 'Leh'];
      const budgets = [15000, 37500, 75000, 150000];
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      const randomDays = Math.floor(Math.random() * 6) + 3; // 3-8 days
      const randomBudget = budgets[Math.floor(Math.random() * budgets.length)];
      const randomInterests = this.getRandomInterests();
      const randomGroupSize = Math.floor(Math.random() * 4) + 1;
      
      const itinerary = this.generateItinerary(randomCity, randomDays, randomBudget, randomInterests, 'moderate', randomGroupSize);
      this.displayItinerary(itinerary);
      this.hideLoading();
    }, 2000);
  }

  getRandomInterests() {
    const allInterests = [
      'culture', 'food', 'nature', 'adventure', 'art', 'shopping', 
      'nightlife', 'photography', 'spiritual', 'beaches', 'wellness', 'local-life'
    ];
    const numberOfInterests = Math.floor(Math.random() * 4) + 2; // 2-5 interests
    const shuffled = allInterests.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numberOfInterests);
  }

  generateItinerary(city, days, budget, interests, travelStyle = 'moderate', groupSize = 2) {
    // Activity count based on travel style
    const styleMultipliers = {
      relaxed: 0.7,
      moderate: 1,
      packed: 1.4,
      flexible: 0.9
    };
    
    const baseActivitiesPerDay = Math.round(3 * styleMultipliers[travelStyle]);
    
    // Enhanced mock data with more realistic pricing in INR
    const cityData = {
      'Mumbai': {
        attractions: [
          { name: 'Gateway of India', time: 'Morning', cost: 0, category: 'culture', description: 'Iconic monument overlooking the Arabian Sea' },
          { name: 'Elephanta Caves', time: 'Afternoon', cost: 40, category: 'culture', description: 'Ancient rock-cut caves with sculptures' },
          { name: 'Marine Drive', time: 'Evening', cost: 0, category: 'nature', description: 'Scenic promenade along the coast' },
          { name: 'Street Food Tour', time: 'Night', cost: 800, category: 'food', description: 'Authentic local cuisine experience' },
          { name: 'Chhatrapati Shivaji Terminus', time: 'Morning', cost: 0, category: 'culture', description: 'UNESCO World Heritage railway station' },
          { name: 'Bollywood Studio Tour', time: 'Afternoon', cost: 2500, category: 'art', description: 'Behind-the-scenes movie magic' },
          { name: 'Juhu Beach', time: 'Evening', cost: 0, category: 'beaches', description: 'Popular beach with street food stalls' },
          { name: 'Haji Ali Dargah', time: 'Morning', cost: 0, category: 'spiritual', description: 'Mosque on an islet in the Arabian Sea' },
          { name: 'Crawford Market', time: 'Afternoon', cost: 200, category: 'shopping', description: 'Historic market for local shopping' },
          { name: 'Bandra-Worli Sea Link', time: 'Evening', cost: 75, category: 'photography', description: 'Cable-stayed bridge with city views' },
          { name: 'Dharavi Slum Tour', time: 'Morning', cost: 1200, category: 'local-life', description: 'Authentic community experience' },
          { name: 'Prince of Wales Museum', time: 'Afternoon', cost: 300, category: 'art', description: 'Premier art and history museum' }
        ]
      },
      'Delhi': {
        attractions: [
          { name: 'Red Fort', time: 'Morning', cost: 35, category: 'culture', description: 'Mughal fortress and UNESCO World Heritage site' },
          { name: 'India Gate', time: 'Afternoon', cost: 0, category: 'culture', description: 'War memorial and popular picnic spot' },
          { name: 'Connaught Place', time: 'Evening', cost: 1200, category: 'shopping', description: 'Shopping and dining hub' },
          { name: 'Lotus Temple', time: 'Morning', cost: 0, category: 'spiritual', description: 'Baháʼí House of Worship' },
          { name: 'Chandni Chowk Food Walk', time: 'Afternoon', cost: 800, category: 'food', description: 'Old Delhi culinary adventure' },
          { name: 'Qutub Minar', time: 'Evening', cost: 30, category: 'culture', description: 'Medieval Islamic monument' },
          { name: 'Humayuns Tomb', time: 'Morning', cost: 30, category: 'culture', description: 'Mughal architecture masterpiece' },
          { name: 'Akshardham Temple', time: 'Afternoon', cost: 170, category: 'spiritual', description: 'Modern Hindu temple complex' },
          { name: 'Lodi Gardens', time: 'Evening', cost: 0, category: 'nature', description: 'City park with medieval tombs' },
          { name: 'Khan Market', time: 'Afternoon', cost: 800, category: 'shopping', description: 'Upmarket shopping destination' },
          { name: 'Paranthe Wali Gali', time: 'Morning', cost: 300, category: 'food', description: 'Famous street for stuffed parathas' },
          { name: 'National Gallery of Modern Art', time: 'Afternoon', cost: 20, category: 'art', description: 'Contemporary Indian art collection' }
        ]
      },
      'Goa': {
        attractions: [
          { name: 'Baga Beach', time: 'Morning', cost: 0, category: 'beaches', description: 'Popular beach with water sports' },
          { name: 'Old Goa Churches', time: 'Afternoon', cost: 25, category: 'culture', description: 'Portuguese colonial architecture' },
          { name: 'Sunset at Anjuna Beach', time: 'Evening', cost: 0, category: 'nature', description: 'Scenic beach with flea market' },
          { name: 'Beach Shack Dinner', time: 'Night', cost: 1200, category: 'food', description: 'Fresh seafood by the ocean' },
          { name: 'Spice Plantation Tour', time: 'Morning', cost: 600, category: 'nature', description: 'Organic spice farm experience' },
          { name: 'Dudhsagar Falls', time: 'Afternoon', cost: 800, category: 'adventure', description: 'Spectacular waterfall trek' },
          { name: 'Chapora Fort', time: 'Evening', cost: 0, category: 'photography', description: 'Hilltop fort with panoramic views' },
          { name: 'Saturday Night Market', time: 'Night', cost: 200, category: 'shopping', description: 'Vibrant market with local crafts' },
          { name: 'Yoga Session on Beach', time: 'Morning', cost: 500, category: 'wellness', description: 'Beachfront yoga and meditation' },
          { name: 'Fontainhas Heritage Walk', time: 'Afternoon', cost: 300, category: 'local-life', description: 'Colorful Portuguese quarter tour' },
          { name: 'Casino Cruise', time: 'Night', cost: 1500, category: 'nightlife', description: 'Offshore gaming and entertainment' },
          { name: 'Aguada Fort', time: 'Morning', cost: 25, category: 'culture', description: 'Portuguese fort with lighthouse' }
        ]
      },
      // Default for other cities
      'default': {
        attractions: [
          { name: 'City Center Exploration', time: 'Morning', cost: 200, category: 'culture', description: 'Discover the heart of the city' },
          { name: 'Local Market Visit', time: 'Afternoon', cost: 400, category: 'shopping', description: 'Shop for local crafts and souvenirs' },
          { name: 'Sunset Viewpoint', time: 'Evening', cost: 100, category: 'nature', description: 'Best views in the city' },
          { name: 'Traditional Dinner', time: 'Night', cost: 1000, category: 'food', description: 'Authentic local cuisine' },
          { name: 'Museum Visit', time: 'Morning', cost: 150, category: 'art', description: 'Local history and culture' },
          { name: 'Adventure Activity', time: 'Afternoon', cost: 1500, category: 'adventure', description: 'Thrilling outdoor experience' },
          { name: 'Photography Walk', time: 'Morning', cost: 300, category: 'photography', description: 'Capture the citys essence' },
          { name: 'Spiritual Site Visit', time: 'Afternoon', cost: 50, category: 'spiritual', description: 'Local temples and monuments' },
          { name: 'Wellness Center', time: 'Evening', cost: 800, category: 'wellness', description: 'Relaxing spa treatment' },
          { name: 'Local Neighborhood Tour', time: 'Morning', cost: 400, category: 'local-life', description: 'Experience daily life' }
        ]
      }
    };

    const selectedCity = cityData[city] || cityData.default;
    let filteredAttractions = [];
    
    if (interests && interests.length > 0) {
      filteredAttractions = selectedCity.attractions.filter(attraction => 
        interests.some(interest => attraction.category === interest)
      );
      // If filtered list is too small, add some other attractions
      if (filteredAttractions.length < days * 2) {
        const remaining = selectedCity.attractions.filter(attraction => 
          !interests.some(interest => attraction.category === interest)
        );
        filteredAttractions = [...filteredAttractions, ...remaining].slice(0, days * baseActivitiesPerDay);
      }
    } else {
      filteredAttractions = selectedCity.attractions;
    }

    // Shuffle attractions to ensure variety
    filteredAttractions.sort(() => 0.5 - Math.random());

    // Generate itinerary
    const activitiesPerDay = Math.min(baseActivitiesPerDay, Math.floor(filteredAttractions.length / days));
    const itinerary = {
      city,
      days: parseInt(days),
      budget,
      groupSize: parseInt(groupSize),
      dayPlans: [],
      summary: {}
    };

    let totalCost = 0;
    let attractionIndex = 0;

    for (let i = 1; i <= days; i++) {
      const dayActivities = [];
      for (let j = 0; j < activitiesPerDay; j++) {
        if (attractionIndex >= filteredAttractions.length) {
          attractionIndex = 0; // Loop back if we run out of unique attractions
        }
        const attraction = filteredAttractions[attractionIndex++];
        dayActivities.push({
          name: attraction.name,
          time: attraction.time,
          cost: attraction.cost * groupSize, // Multiply by group size
          category: attraction.category,
          description: attraction.description
        });
      }

      // Calculate day cost
      const dayCost = Math.round(dayActivities.reduce((sum, activity) => sum + activity.cost, 0));
      totalCost += dayCost;

      itinerary.dayPlans.push({
        day: i,
        activities: dayActivities,
        cost: dayCost
      });
    }

    // Add summary
    const totalBudget = budget * groupSize;
    itinerary.summary = {
      totalCost: Math.round(totalCost),
      avgCostPerDay: Math.round(totalCost / days),
      highlights: itinerary.dayPlans.slice(0, 3).map(day => day.activities[0]?.name).filter(Boolean),
      totalActivities: itinerary.dayPlans.reduce((sum, day) => sum + day.activities.length, 0),
      budgetUtilization: Math.round((totalCost / totalBudget) * 100),
      travelStyle: travelStyle,
      totalBudget: totalBudget
    };

    return itinerary;
  }

  displayItinerary(itinerary) {
    const resultsContainer = document.querySelector('[data-id="results-container"]');
    if (!resultsContainer) return;

    let html = `
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-xl">
          <h2 class="text-2xl font-bold mb-2">${itinerary.city} - ${itinerary.days} Day Adventure</h2>
          <div class="flex flex-wrap gap-4 text-sm">
            <span class="bg-white/20 px-3 py-1 rounded-full">Total: ₹${itinerary.summary.totalCost.toLocaleString()}</span>
            <span class="bg-white/20 px-3 py-1 rounded-full">Per Day: ₹${itinerary.summary.avgCostPerDay.toLocaleString()}</span>
            <span class="bg-white/20 px-3 py-1 rounded-full">${itinerary.summary.totalActivities} Activities</span>
            <span class="bg-white/20 px-3 py-1 rounded-full">Group: ${itinerary.groupSize} ${itinerary.groupSize === 1 ? 'person' : 'people'}</span>
          </div>
          <div class="mt-3 flex items-center gap-2">
            <div class="bg-white/20 px-3 py-1 rounded-full text-sm">
              Budget Usage: ${itinerary.summary.budgetUtilization}% ${itinerary.summary.budgetUtilization <= 100 ? '✅' : '⚠️'}
            </div>
          </div>
        </div>
        
        <div class="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${itinerary.dayPlans.map(day => `
            <div class="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
              <div class="bg-gray-50 px-4 py-3 border-b">
                <h3 class="text-lg font-semibold text-gray-800">Day ${day.day}</h3>
              </div>
              <div class="p-4 space-y-4">
                ${day.activities.map(activity => `
                  <div class="flex items-start space-x-3">
                    <div class="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <i data-lucide="${this.getActivityIcon(activity.category)}" class="w-4 h-4 text-blue-600"></i>
                    </div>
                    <div class="flex-1">
                      <h4 class="font-semibold text-gray-900">${activity.name}</h4>
                      <p class="text-sm text-gray-600">${activity.description}</p>
                      <div class="flex items-center justify-between mt-1">
                        <span class="text-xs text-gray-500">${activity.time}</span>
                        <span class="text-sm font-medium text-green-600">₹${activity.cost.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
              <div class="bg-gray-50 px-4 py-3 border-t">
                <div class="flex justify-between items-center text-sm">
                  <span class="text-gray-600">Day ${day.day} Total</span>
                  <span class="font-semibold text-gray-900">₹${day.cost.toLocaleString()}</span>
                </div>
              </div>
            </div>
          `).join('')} 
          
          <!-- Trip Summary -->
          <div class="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
            <div class="bg-gray-50 px-4 py-3 border-b">
              <h3 class="text-lg font-semibold text-gray-800">Trip Summary</h3>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div class="text-center p-4 ${itinerary.summary.budgetUtilization <= 100 ? 'bg-green-50' : 'bg-orange-50'} rounded-lg">
                  <div class="text-2xl font-bold ${itinerary.summary.budgetUtilization <= 100 ? 'text-green-600' : 'text-orange-600'}">₹${itinerary.summary.totalCost.toLocaleString()}</div>
                  <div class="text-sm text-gray-600">Total Cost</div>
                </div>
                <div class="text-center p-4 bg-blue-50 rounded-lg">
                  <div class="text-2xl font-bold text-blue-600">₹${itinerary.summary.avgCostPerDay.toLocaleString()}</div>
                  <div class="text-sm text-gray-600">Per Day Average</div>
                </div>
              </div>

              <div class="space-y-2 mb-4">
                <div class="flex justify-between items-center text-sm">
                  <span class="text-gray-600">Destination:</span>
                  <span class="font-semibold text-gray-900">${itinerary.city}</span>
                </div>
                <div class="flex justify-between items-center text-sm">
                  <span class="text-gray-600">Duration:</span>
                  <span class="font-semibold text-gray-900">${itinerary.days} days</span>
                </div>
                <div class="flex justify-between items-center text-sm">
                  <span class="text-gray-600">Budget (Total):</span>
                  <span class="font-semibold text-gray-900">₹${itinerary.summary.totalBudget.toLocaleString()}</span>
                </div>
                <div class="flex justify-between items-center text-sm">
                  <span class="text-gray-600">Group Size:</span>
                  <span class="font-semibold text-gray-900">${itinerary.groupSize} ${itinerary.groupSize === 1 ? 'person' : 'people'}</span>
                </div>
                <div class="flex justify-between items-center text-sm">
                  <span class="text-gray-600">Travel Style:</span>
                  <span class="font-semibold text-gray-900">${itinerary.summary.travelStyle.charAt(0).toUpperCase() + itinerary.summary.travelStyle.slice(1)}</span>
                </div>
              </div>

              <h5 class="font-semibold text-gray-800 mb-2">Highlights:</h5>
              <ul class="list-disc list-inside text-sm text-gray-600 space-y-1">
                ${itinerary.summary.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
              </ul>
              
              <!-- Action Buttons -->
              <div class="mt-6 space-y-3">
                <button class="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium" onclick="alert('PDF export coming soon!')">
                  <i data-lucide="download" class="w-4 h-4 inline mr-2"></i>
                  Export as PDF
                </button>
                <button class="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium" onclick="navigator.share ? navigator.share({title: 'My Travel Itinerary', url: window.location.href}) : (navigator.clipboard.writeText(window.location.href), alert('Link copied!'))">
                  <i data-lucide="share-2" class="w-4 h-4 inline mr-2"></i>
                  Share Itinerary
                </button>
                <button id="new-search-btn" class="w-full px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium" onclick="document.getElementById('results-section').classList.add('hidden'); document.querySelector('section').scrollIntoView({behavior: 'smooth'});">
                  <i data-lucide="plus" class="w-4 h-4 inline mr-2"></i>
                  Plan Another Trip
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    resultsContainer.innerHTML = html;
    document.getElementById('results-section').classList.remove('hidden');
    document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' });
    
    // Re-initialize Lucide icons
    setTimeout(() => {
      lucide.createIcons();
    }, 100);
  }

  showLoading() {
    document.getElementById('loading-state').classList.remove('hidden');
  }

  hideLoading() {
    document.getElementById('loading-state').classList.add('hidden');
  }

  getActivityIcon(type) {
    const icons = {
      culture: 'building',
      food: 'utensils',
      nature: 'trees',
      nightlife: 'moon',
      shopping: 'shopping-bag',
      adventure: 'mountain',
      art: 'palette',
      photography: 'camera',
      spiritual: 'church',
      beaches: 'sun',
      wellness: 'heart',
      'local-life': 'users'
    };
    return icons[type] || 'map-pin';
  }
}

// Create and initialize the app
const app = new LocaluxeApp();

// Export the initialization function for module usage
function initializeApp() {
  app.initializeApp();
  console.log('Localuxe app initialized with enhanced features');
}

// Export for module usage
export { initializeApp };

// Auto-initialize when loaded as regular script
if (typeof module === 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    app.initializeApp();
  });
}