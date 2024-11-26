import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';

const serviceCategories = {
  'Extra Small - $75': {
    price: 75,
    services: [
      'Cheeks', 'Chin', 'Ears', 'Eyebrow (Between Brows)', 'Hairline',
      'Hands', 'Lip (Lower or Upper)', 'Nipple', 'Sideburns',
      'Stomach Strip', 'Toes'
    ]
  },
  'Small - $125': {
    price: 125,
    services: [
      'Back (Upper)', 'Back (Mid)', 'Back (Lower)', 'Bikini Line',
      'Butt Strip', 'Chest Strip', 'Inner Thigh', 'Neck',
      'Stomach (Full)', 'Underarms'
    ]
  },
  'Medium - $200': {
    price: 200,
    services: [
      'Arms (Half)', 'Bikini Brazilian', 'Bikini Full', 'Full Butt',
      'Full Face', 'Leg Upper', 'Leg Lower', 'Shoulders'
    ]
  },
  'Large - $300': {
    price: 300,
    services: ['Full Chest', 'Full Arms', 'Full Back', 'Full Legs']
  }
};

const packages = {
  'Unlimited': { sessions: 12, discount: 0.25 },
  '6 Pack': { sessions: 6, discount: 0.0 },
  '6+1 Pack': { sessions: 7, discount: 0.14 },
  'BOGO 20': { sessions: 6, discount: 0.0 }
};

const getPackageDisplayText = (name) => {
  switch (name) {
    case 'Unlimited':
      return 'Unlimited - 2 Years (25% off)';
    case '6+1 Pack':
      return '6+1 Pack (14% off)';
    case 'BOGO 20':
      return 'BOGO 20 - Buy One Get One 20% Off';
    default:
      return '6 Pack';
  }
};

const LaserPackageCalculator = () => {
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [payments, setPayments] = useState(1);
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

  const calculatePricePerTreatment = () => {
    if (!selectedPackage) return 0;
    const baseTotal = selectedServices.reduce((sum, item) => sum + item.price, 0);
    
    if (selectedPackage === 'BOGO 20' && selectedServices.length >= 2) {
      const sortedPrices = selectedServices.map(item => item.price).sort((a, b) => b - a);
      const totalWithDiscount = sortedPrices[0] + (sortedPrices[1] * 0.8) + 
        sortedPrices.slice(2).reduce((sum, price) => sum + price, 0);
      return totalWithDiscount.toFixed(2);
    }
    
    return (baseTotal * (1 - packages[selectedPackage].discount)).toFixed(2);
  };

  const calculateTotal = (installments = 1) => {
    if (!selectedPackage) return 0;
    const pricePerTreatment = parseFloat(calculatePricePerTreatment());
    const totalPackagePrice = pricePerTreatment * packages[selectedPackage].sessions;
    return (totalPackagePrice / installments).toFixed(2);
  };

  const getDiscountText = () => {
    if (!selectedPackage) return '';
    if (selectedPackage === 'BOGO 20') {
      return selectedServices.length >= 2 ? '(20% OFF second treatment)' : '';
    }
    return packages[selectedPackage].discount > 0 ? 
      `(${packages[selectedPackage].discount * 100}% OFF)` : '';
  };

  return (
    <Card className="w-full max-w-3xl mx-auto bg-[#f4f3f6] font-sans">
      <div className="w-full p-8 flex justify-center bg-white border-b-2 border-[#2c0e45]">
        <div className="w-40 h-20 bg-[#f2e5d6] flex items-center justify-center text-[#2c0e45] font-bold rounded">
          LOGO PLACEHOLDER
        </div>
      </div>
      <CardHeader className="bg-[#2c0e45] text-white py-6">
        <CardTitle className="text-2xl text-center font-bold">EWC Laser Hair Removal Package Calculator</CardTitle>
      </CardHeader>
      <CardContent className="p-8 space-y-8">
        <div>
          <label className="block text-base font-bold mb-3 text-[#2c0e45]">SELECT PACKAGE</label>
          <Select onValueChange={setSelectedPackage}>
            <SelectTrigger className="border-2 border-[#2c0e45] h-12">
              <SelectValue placeholder="Choose your package" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(packages).map((name) => (
                <SelectItem key={name} value={name} className="text-[#2c0e45]">
                  {getPackageDisplayText(name)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-base font-bold text-[#2c0e45]">TREATMENT AREAS</label>
            <Button 
              onClick={() => setShowServiceSelect(true)}
              className="bg-[#e91f4e] hover:bg-[#c41840] text-white flex items-center gap-2"
            >
              <Plus size={20} /> Add Service
            </Button>
          </div>
          {showServiceSelect && (
            <Select onValueChange={addService}>
              <SelectTrigger className="border-2 border-[#2c0e45] h-12">
                <SelectValue placeholder="Select treatment area" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {Object.entries(serviceCategories).map(([category, { services }]) => (
                  <div key={category} className="p-2">
                    <div className="font-bold text-[#2c0e45] pb-2">{category}</div>
                    {services.map((service) => (
                      <SelectItem 
                        key={service} 
                        value={service}
                        className="cursor-pointer hover:bg-[#e91f4e] hover:text-white py-2"
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
            <div key={index} className="flex justify-between items-center bg-white p-4 rounded-lg border-2 border-[#2c0e45]">
              <span className="font-medium text-[#2c0e45]">
                {item.service} - ${item.price}
              </span>
              <Button 
                onClick={() => removeService(index)}
                className="bg-[#e91f4e] hover:bg-[#c41840] text-white"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>

        <div>
          <label className="block text-base font-bold mb-3 text-[#2c0e45]">PAYMENT PLAN</label>
          <Select onValueChange={(value) => setPayments(parseInt(value))}>
            <SelectTrigger className="border-2 border-[#2c0e45] h-12">
              <SelectValue placeholder="Select number of payments" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <SelectItem key={num} value={num}>
                  {num} {num === 1 ? 'Payment' : 'Payments'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedPackage && selectedServices.length > 0 && (
          <div className="mt-8 space-y-4 bg-white p-6 rounded-lg text-[#2c0e45] border-2 border-[#2c0e45]">
            <div className="text-xl">
              Price Per Treatment: ${calculatePricePerTreatment()}
              <span className="text-[#e91f4e] ml-2 font-bold">
                {getDiscountText()}
              </span>
            </div>
            <div className="text-3xl font-bold">
              Package Total: ${calculateTotal()}
              <span className="text-lg ml-2">
                ({packages[selectedPackage].sessions} treatments)
              </span>
            </div>
            {payments > 1 && (
              <div className="text-xl border-t border-[#2c0e45] pt-4 mt-4">
                ${calculateTotal(payments)} per payment
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LaserPackageCalculator;
