import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
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
  'Standard 6 Pack': { sessions: 6, discount: 0.0 },
  '6+1 Pack': { sessions: 7, discount: 0.14 },
  'BOGO 20': { sessions: 6, discount: 0.0 },
  'Touch Up 4 Pack': { sessions: 4, discount: 0.25 },
  'Touch Up 3 Pack': { sessions: 3, discount: 0.0 }
};

const getPackageDisplayText = (name) => {
  switch (name) {
    case 'Unlimited':
      return 'Unlimited - 2 Years (25% off)';
    case '6+1 Pack':
      return '6+1 Pack (14% off)';
    case 'BOGO 20':
      return 'BOGO 20 - Buy One Get One 20% Off';
    case 'Touch Up 4 Pack':
      return 'Touch Up 4 Pack (25% off)';
    case 'Touch Up 3 Pack':
      return 'Touch Up 3 Pack';
    default:
      return 'Standard 6 Pack';
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
      `(${(packages[selectedPackage].discount * 100).toFixed(0)}% OFF)` : '';
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
        <CardTitle className="text-2xl text-center font-bold font-poppins">EWC Laser Hair Removal Package Calculator</CardTitle>
      </CardHeader>
      <CardContent className="p-8 space-y-8">
        <div className="w-full">
          <label className="block text-base font-bold mb-3 text-[#2c0e45] font-poppins">SELECT PACKAGE</label>
          <Select onValueChange={setSelectedPackage}>
            <SelectTrigger className="border-2 border-[#2c0e45] h-12 w-full rounded-lg bg-white font-poppins">
              <SelectValue placeholder="Choose your package" className="font-poppins" />
            </SelectTrigger>
            <SelectContent className="bg-white border-2 border-[#2c0e45] rounded-lg max-h-[300px] overflow-y-auto font-poppins">
              {Object.keys(packages).map((name) => (
                <SelectItem 
                  key={name} 
                  value={name} 
                  className="text-[#2c0e45] p-2 hover:bg-[#f4f3f6] cursor-pointer rounded font-poppins"
                >
                  {getPackageDisplayText(name)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-base font-bold text-[#2c0e45] font-poppins">TREATMENT AREAS</label>
            <Button 
              onClick={() => setShowServiceSelect(true)}
              className="bg-[#e91f4e] hover:bg-[#c41840] text-white flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 shadow-md hover:shadow-lg font-poppins"
            >
              <Plus size={20} className="rounded-full" /> Add Service
            </Button>
          </div>
          {showServiceSelect && (
            <Select onValueChange={addService}>
              <SelectTrigger className="border-2 border-[#2c0e45] h-12 w-full rounded-lg bg-white font-poppins">
                <SelectValue placeholder="Select treatment area" className="font-poppins" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-[#2c0e45] rounded-lg overflow-y-auto max-h-[40vh] font-poppins">
                {Object.entries(serviceCategories).map(([category, { services }]) => (
                  <div key={category} className="p-2">
                    <div className="font-bold text-[#2c0e45] pb-2 border-b border-[#2c0e45]">{category}</div>
                    {services.map((service) => (
                      <SelectItem 
                        key={service} 
                        value={service}
                        className="text-[#2c0e45] p-2 hover:bg-[#f4f3f6] cursor-pointer rounded mt-1 font-poppins"
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

        <div className="space-y-3 w-full">
          {selectedServices.map((item, index) => (
            <div key={index} className="flex justify-between items-center bg-white p-4 rounded-lg border-2 border-[#2c0e45] shadow-sm">
              <span className="font-medium text-[#2c0e45] font-poppins">
                {item.service} - ${item.price}
              </span>
              <Button 
                onClick={() => removeService(index)}
                className="bg-[#e91f4e] hover:bg-[#c41840] text-white px-4 py-2 rounded-full transition-all duration-200 font-poppins"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>

        <div className="w-full">
          <label className="block text-base font-bold mb-3 text-[#2c0e45] font-poppins">PAYMENT PLAN</label>
          <Select onValueChange={(value) => setPayments(parseInt(value))}>
            <SelectTrigger className="border-2 border-[#2c0e45] h-12 w-full rounded-lg bg-white font-poppins">
              <SelectValue placeholder="Select number of payments" className="font-poppins" />
            </SelectTrigger>
            <SelectContent className="bg-white border-2 border-[#2c0e45] rounded-lg font-poppins">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <SelectItem 
                  key={num} 
                  value={num}
                  className="text-[#2c0e45] p-2 hover:bg-[#f4f3f6] cursor-pointer rounded font-poppins"
                >
                  {num} {num === 1 ? 'Payment' : 'Payments'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedPackage && selectedServices.length > 0 && (
          <div className="mt-8 space-y-4 bg-white p-6 rounded-lg text-[#2c0e45] border-2 border-[#2c0e45] shadow-lg font-poppins">
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
