import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const serviceCategories = {
  'Extra Small': {
    price: 75,
    services: [
      'Cheeks', 'Chin', 'Ears', 'Eyebrow (Between Brows)', 'Hairline',
      'Hands', 'Lip (Lower or Upper)', 'Nipple', 'Sideburns',
      'Stomach Strip', 'Toes'
    ]
  },
  'Small': {
    price: 125,
    services: [
      'Back (Upper)', 'Back (Mid)', 'Back (Lower)', 'Bikini Line',
      'Butt Strip', 'Chest Strip', 'Inner Thigh', 'Neck',
      'Stomach (Full)', 'Underarms'
    ]
  },
  'Medium': {
    price: 200,
    services: [
      'Arms (Half)', 'Bikini Brazilian', 'Bikini Full', 'Full Butt',
      'Full Face', 'Leg Upper', 'Leg Lower', 'Shoulders'
    ]
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
      return [1, 2];
    }
    return [1, 2, 4, 6];
  };

  const calculatePricePerTreatment = (service) => {
    if (!selectedPackage) return 0;
    const packageInfo = packageTypes[selectedPackage];
    return (service.price * (1 - packageInfo.discount)).toFixed(2);
  };

  const calculateServiceTotal = (service) => {
    if (!selectedPackage) return 0;
    const pricePerTreatment = parseFloat(calculatePricePerTreatment(service));
    return (pricePerTreatment * packageTypes[selectedPackage].sessions).toFixed(2);
  };

  const calculateSubtotal = () => {
    return selectedServices.reduce((sum, service) => 
      sum + parseFloat(calculateServiceTotal(service)), 0
    ).toFixed(2);
  };

  const calculateTax = () => {
    if (!location) return 0;
    const subtotal = parseFloat(calculateSubtotal());
    return (subtotal * (location === 'Queens' ? 0.045 : 0)).toFixed(2);
  };

  const calculateTotal = () => {
    return (parseFloat(calculateSubtotal()) + parseFloat(calculateTax())).toFixed(2);
  };

  const calculatePaymentAmount = () => {
    if (!payments || payments === 1) return calculateTotal();
    return (parseFloat(calculateTotal()) / payments).toFixed(2);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto bg-[#f4f3f6] font-poppins shadow-lg">
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
        {/* Treatment Areas Selection */}
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
                <SelectValue placeholder="Select treatment area" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-[#2c0e45] rounded-lg max-h-[40vh]">
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

        {/* Selected Services List */}
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

        {/* Package Selection */}
        {selectedServices.length > 0 && (
          <div>
            <label className="block text-base font-bold mb-3 text-[#2c0e45]">PACKAGE TYPE</label>
            <Select onValueChange={setSelectedPackage}>
              <SelectTrigger className="border-2 border-[#2c0e45] h-12 w-full rounded-lg bg-white">
                <SelectValue placeholder="Select package type" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(packageTypes).map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Payment Plan */}
        {selectedPackage && (
          <div>
            <label className="block text-base font-bold mb-3 text-[#2c0e45]">PAYMENT PLAN</label>
            <Select onValueChange={(value) => setPayments(parseInt(value))}>
              <SelectTrigger className="border-2 border-[#2c0e45] h-12 w-full rounded-lg bg-white">
                <SelectValue placeholder="Select payment plan" />
              </SelectTrigger>
              <SelectContent>
                {getPaymentOptions().map((num) => (
                  <SelectItem key={num} value={num}>
                    {num === 1 ? 'Upfront' : `${num} installments`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Location Selection */}
        {selectedPackage && payments && (
          <div>
            <label className="block text-base font-bold mb-3 text-[#2c0e45]">LOCATION</label>
            <Select onValueChange={setLocation}>
              <SelectTrigger className="border-2 border-[#2c0e45] h-12 w-full rounded-lg bg-white">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc) => (
                  <SelectItem key={loc.name} value={loc.name}>{loc.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Price Summary */}
        {selectedPackage && selectedServices.length > 0 && location && (
          <div className="mt-8 space-y-4 bg-white p-6 rounded-lg text-[#2c0e45] border-2 border-[#2c0e45] shadow-lg">
            {/* Individual Service Breakdowns */}
            {selectedServices.map((service, index) => (
              <div key={index} className="pb-4 border-b border-[#2c0e45] last:border-0">
                <div className="font-bold mb-2">{service.service}</div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Price Per Treatment:</span>
                    <span>${calculatePricePerTreatment(service)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Package Total:</span>
                    <span>${calculateServiceTotal(service)}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Overall Summary */}
            <div className="pt-4 space-y-2">
              <div className="flex justify-between font-bold">
                <span>Subtotal:</span>
                <span>${calculateSubtotal()}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax ({location === 'Queens' ? '4.5%' : '0%'}):</span>
                <span>${calculateTax()}</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-4 border-t border-[#2c0e45]">
                <span>Total:</span>
                <span>${calculateTotal()}</span>
              </div>
              {payments > 1 && (
                <div className="flex justify-between text-lg font-bold pt-2">
                  <span>Per Payment:</span>
                  <span>${calculatePaymentAmount()}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LaserPackageCalculator;
