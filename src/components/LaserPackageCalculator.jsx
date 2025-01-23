import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const serviceCategories = {
  'Extra Small': {
    price: 75,
    services: ['Cheeks', 'Chin', 'Ears', 'Eyebrow (Between Brows)', 'Hairline',
    'Hands', 'Lip (Lower or Upper)', 'Nipple', 'Sideburns', 'Stomach Strip', 'Toes']
  },
  'Small': {
    price: 125,
    services: ['Back (Upper)', 'Back (Mid)', 'Back (Lower)', 'Bikini Line',
    'Butt Strip', 'Chest Strip', 'Inner Thigh', 'Neck', 'Stomach (Full)', 'Underarms']
  },
  'Medium': {
    price: 200,
    services: ['Arms (Half)', 'Bikini Brazilian', 'Bikini Full', 'Full Butt',
    'Full Face', 'Leg Upper', 'Leg Lower', 'Shoulders']
  },
  'Large': {
    price: 300,
    services: ['Full Chest', 'Full Arms', 'Full Back', 'Full Legs']
  }
};

const packageTypes = {
  'Standard 6': { sessions: 6, discount: 0.0 },
  '6+1 Standard': { sessions: 7, discount: 0.14 },
  'Unlimited': { sessions: 12, discount: 0.25 },
  'Touch Up 3': { sessions: 3, discount: 0.0 },
  'Touch Up 3+1': { sessions: 4, discount: 0.0 }
};

const locations = [
  { name: 'Queens', taxRate: 0.045 },
  { name: 'Long Island', taxRate: 0 }
];

const LaserPackageCalculator = () => {
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [payments, setPayments] = useState(1);
  const [location, setLocation] = useState(null);
  const [showServiceSelect, setShowServiceSelect] = useState(false);

  // Calculation functions
  const findServiceCategory = (serviceName) => {
    for (const [category, data] of Object.entries(serviceCategories)) {
      if (data.services.includes(serviceName)) {
        return { category, price: data.price };
      }
    }
    return null;
  };

  const addService = (serviceName) => {
    const categoryInfo = findServiceCategory(serviceName);
    if (categoryInfo) {
      setSelectedServices([...selectedServices, {
        service: serviceName,
        price: categoryInfo.price,
        category: categoryInfo.category
      }]);
      setShowServiceSelect(false);
    }
  };

  const removeService = (index) => {
    setSelectedServices(selectedServices.filter((_, i) => i !== index));
  };

  const getPaymentOptions = () => {
    if (!selectedPackage) return [];
    if (selectedPackage.includes('Touch Up')) {
      return [
        { value: 1, label: 'Upfront' },
        { value: 2, label: '2 installments' }
      ];
    }
    return [
      { value: 1, label: 'Upfront' },
      { value: 2, label: '2 installments' },
      { value: 4, label: '4 installments' },
      { value: 6, label: '6 installments' }
    ];
  };

  const calculatePricePerTreatment = (service) => {
    if (!selectedPackage) return 0;
    const basePrice = service.price;
    const packageInfo = packageTypes[selectedPackage];
    const discountedPrice = basePrice * (1 - packageInfo.discount);
    return discountedPrice;
  };

  const calculateServiceTotal = (service) => {
    if (!selectedPackage) return 0;
    const pricePerTreatment = calculatePricePerTreatment(service);
    const packageInfo = packageTypes[selectedPackage];
    return pricePerTreatment * packageInfo.sessions;
  };

  const calculateSubtotal = () => {
    return selectedServices.reduce((sum, service) => sum + calculateServiceTotal(service), 0);
  };

  const calculateTax = () => {
    if (!location) return 0;
    const loc = locations.find(l => l.name === location);
    return calculateSubtotal() * loc.taxRate;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const calculateTotalPerTreatment = () => {
    if (!selectedPackage) return 0;
    const total = calculateTotal();
    return total / packageTypes[selectedPackage].sessions;
  };

  const calculateTotalPerPayment = () => {
    if (!payments) return 0;
    const total = calculateTotal();
    return total / payments;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-[#f4f3f6] font-poppins shadow-lg">
      <div className="w-full p-8 flex justify-center bg-white border-b-2 border-[#2c0e45]">
        <div className="w-40 h-20 bg-white flex items-center justify-center">
          <img 
            src="https://storage.googleapis.com/msgsndr/P0wBME8H6tGaE7dMDT4H/media/66fac7439da07b34bd73061d.png"
            alt="EWC Logo"
            className="w-auto h-full object-contain"
          />
        </div>
      </div>

      <CardHeader className="bg-[#2c0e45] text-white py-6">
        <CardTitle className="text-2xl text-center font-bold">EWC Laser Hair Removal Package Calculator</CardTitle>
      </CardHeader>

      <CardContent className="p-8 space-y-8">
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-base font-bold text-[#2c0e45]">TREATMENT AREA(S)</label>
            <Button 
              onClick={() => setShowServiceSelect(true)}
              className="bg-[#e91f4e] hover:bg-[#c41840] text-white flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Plus size={20} className="rounded-full" /> Add Service
            </Button>
          </div>
          
          {showServiceSelect && (
            <Select onValueChange={addService}>
              <SelectTrigger className="border-2 border-[#2c0e45] h-12 w-full rounded-lg bg-white">
                <SelectValue placeholder="Select treatment area" className="flex items-center" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-[#2c0e45] rounded-lg overflow-y-auto max-h-[40vh]">
                {Object.entries(serviceCategories).map(([category, { services }]) => (
                  <div key={category} className="p-2">
                    <div className="font-bold text-[#2c0e45] pb-2 border-b border-[#2c0e45]">{category}</div>
                    {services.map((service) => (
                      <SelectItem 
                        key={service} 
                        value={service}
                        className="text-[#2c0e45] p-2 hover:bg-[#f4f3f6] cursor-pointer rounded mt-1"
                      >
                        {service}
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="space-y-3">
          {selectedServices.map((item, index) => (
            <div key={index} className="flex justify-between items-center bg-white p-4 rounded-lg border-2 border-[#2c0e45] shadow-sm">
              <span className="font-medium text-[#2c0e45]">{item.service}</span>
              <Button 
                onClick={() => removeService(index)}
                className="bg-[#e91f4e] hover:bg-[#c41840] text-white px-4 py-2 rounded-full"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>

        {selectedServices.length > 0 && (
          <>
            <div>
              <label className="block text-base font-bold mb-3 text-[#2c0e45]">PACKAGE TYPE</label>
              <Select onValueChange={setSelectedPackage}>
                <SelectTrigger className="border-2 border-[#2c0e45] h-12 w-full rounded-lg bg-white">
                  <SelectValue placeholder="Select package type" className="flex items-center" />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-[#2c0e45] rounded-lg">
                  {Object.keys(packageTypes).map((type) => (
                    <SelectItem key={type} value={type} className="p-2 hover:bg-[#f4f3f6]">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedPackage && (
              <div>
                <label className="block text-base font-bold mb-3 text-[#2c0e45]">PAYMENT PLAN</label>
                <Select onValueChange={(value) => setPayments(parseInt(value))}>
                  <SelectTrigger className="border-2 border-[#2c0e45] h-12 w-full rounded-lg bg-white">
                    <SelectValue placeholder="Select payment plan" className="flex items-center" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-2 border-[#2c0e45] rounded-lg">
                    {getPaymentOptions().map((option) => (
                      <SelectItem key={option.value} value={option.value} className="p-2 hover:bg-[#f4f3f6]">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {payments && (
              <div>
                <label className="block text-base font-bold mb-3 text-[#2c0e45]">LOCATION</label>
                <Select onValueChange={setLocation}>
                  <SelectTrigger className="border-2 border-[#2c0e45] h-12 w-full rounded-lg bg-white">
                    <SelectValue placeholder="Select location" className="flex items-center" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-2 border-[#2c0e45] rounded-lg">
                    {locations.map((loc) => (
                      <SelectItem key={loc.name} value={loc.name} className="p-2 hover:bg-[#f4f3f6]">
                        {loc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </>
        )}

        {selectedPackage && selectedServices.length > 0 && location && (
          <div className="mt-8 bg-white p-6 rounded-lg text-[#2c0e45] border-2 border-[#2c0e45] shadow-lg">
            <div className="grid grid-cols-3 gap-8">
              {/* Column Headers */}
              <div className="font-bold text-lg pb-4 border-b-2 border-[#2c0e45]">Total Package Price</div>
              <div className="font-bold text-lg pb-4 border-b-2 border-[#2c0e45]">Price Per Treatment</div>
              <div className="font-bold text-lg pb-4 border-b-2 border-[#2c0e45]">Price Per Payment</div>

              {/* Individual Services */}
              {selectedServices.map((service, index) => (
                <React.Fragment key={index}>
                  <div className="py-2">
                    {service.service}: ${calculateServiceTotal(service).toFixed(2)}
                  </div>
                  <div className="py-2">
                    {service.service}: ${calculatePricePerTreatment(service).toFixed(2)}
                  </div>
                  <div className="py-2">
                    {service.service}: ${(calculateServiceTotal(service) / payments).toFixed(2)}
                  </div>
                </React.Fragment>
              ))}

              {/* Totals */}
              <div className="pt-4 border-t-2 border-[#2c0e45]">
                <div>Subtotal: ${calculateSubtotal().toFixed(2)}</div>
                {location === 'Queens' && (
                  <div>Tax (4.5%): ${calculateTax().toFixed(2)}</div>
                )}
                <div className="font-bold pt-2">
                  Total: ${calculateTotal().toFixed(2)}
                </div>
              </div>
              <div className="pt-4 border-t-2 border-[#2c0e45] font-bold">
                Total: ${calculateTotalPerTreatment().toFixed(2)}
              </div>
              <div className="pt-4 border-t-2 border-[#2c0e45] font-bold">
                Total: ${calculateTotalPerPayment().toFixed(2)}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LaserPackageCalculator;
