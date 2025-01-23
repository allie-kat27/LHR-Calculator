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

  const addService = () => {
    setSelectedServices([...selectedServices, {
      service: null,
      packageType: null,
      paymentPlan: null,
      price: 0
    }]);
    setShowServiceSelect(true);
  };

  const removeService = (index) => {
    setSelectedServices(selectedServices.filter((_, i) => i !== index));
  };

  const updateService = (index, field, value) => {
    const newServices = [...selectedServices];
    newServices[index] = {
      ...newServices[index],
      [field]: value
    };
    
    if (field === 'service') {
      const categoryInfo = findServiceCategory(value);
      if (categoryInfo) {
        newServices[index].price = categoryInfo.price;
      }
    }
    
    if (field === 'packageType' && value.includes('Touch Up')) {
      if (newServices[index].paymentPlan && parseInt(newServices[index].paymentPlan) > 2) {
        newServices[index].paymentPlan = '1';
      }
    }
    
    setSelectedServices(newServices);
  };

  const getAvailablePaymentPlans = (packageType) => {
    if (!packageType) return [];
    if (packageType.includes('Touch Up')) {
      return [
        { value: '1', label: 'Upfront' },
        { value: '2', label: '2 installments' }
      ];
    }
    return [
      { value: '1', label: 'Upfront' },
      { value: '2', label: '2 installments' },
      { value: '4', label: '4 installments' },
      { value: '6', label: '6 installments' }
    ];
  };

  const calculateServiceTotal = (service) => {
    if (!service.service || !service.packageType || !service.paymentPlan) return 0;
    const basePrice = service.price;
    const packageInfo = packageTypes[service.packageType];
    const discountedPrice = basePrice * (1 - packageInfo.discount);
    return discountedPrice * packageInfo.sessions;
  };

  const calculateSubtotal = () => {
    return selectedServices.reduce((sum, service) => sum + calculateServiceTotal(service), 0);
  };

  const calculateTax = () => {
    if (!location) return 0;
    const loc = locations.find(l => l.name === location);
    return loc ? calculateSubtotal() * loc.taxRate : 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
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
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-base font-bold text-[#2c0e45] font-poppins">TREATMENT AREA(S)</label>
            <Button 
              onClick={addService}
              className="bg-[#e91f4e] hover:bg-[#c41840] text-white flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 shadow-md hover:shadow-lg font-poppins"
            >
              <Plus size={20} className="rounded-full" /> Add Service
            </Button>
          </div>

          <div className="space-y-6">
            {selectedServices.map((service, index) => (
              <div key={index} className="p-4 bg-white rounded-lg border-2 border-[#2c0e45] space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1 space-y-4">
                    <Select 
                      value={service.service}
                      onValueChange={(value) => updateService(index, 'service', value)}
                    >
                      <SelectTrigger className="border-2 border-[#2c0e45] h-12">
                        <SelectValue placeholder="Select treatment area" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {Object.entries(serviceCategories).map(([category, { services }]) => (
                          <div key={category} className="p-2">
                            <div className="font-bold text-[#2c0e45] pb-2 border-b border-[#2c0e45]">{category}</div>
                            {services.map((serviceName) => (
                              <SelectItem 
                                key={serviceName} 
                                value={serviceName}
                                className="cursor-pointer hover:bg-[#f4f3f6] py-2"
                              >
                                {serviceName}
                              </SelectItem>
                            ))}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={service.packageType}
                      onValueChange={(value) => updateService(index, 'packageType', value)}
                    >
                      <SelectTrigger className="border-2 border-[#2c0e45] h-12">
                        <SelectValue placeholder="Select package type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(packageTypes).map(([type, info]) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={service.paymentPlan}
                      onValueChange={(value) => updateService(index, 'paymentPlan', value)}
                    >
                      <SelectTrigger className="border-2 border-[#2c0e45] h-12">
                        <SelectValue placeholder="Select payment plan" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailablePaymentPlans(service.packageType).map((plan) => (
                          <SelectItem key={plan.value} value={plan.value}>
                            {plan.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={() => removeService(index)}
                    className="bg-[#e91f4e] hover:bg-[#c41840] text-white ml-4"
                  >
                    Remove
                  </Button>
                </div>

                {service.service && service.packageType && service.paymentPlan && (
                  <div className="pt-4 border-t border-[#2c0e45] space-y-2">
                    <div className="flex justify-between text-[#2c0e45]">
                      <span>Package Price:</span>
                      <span>${calculateServiceTotal(service).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[#2c0e45]">
                      <span>Per Treatment:</span>
                      <span>${(calculateServiceTotal(service) / packageTypes[service.packageType].sessions).toFixed(2)}</span>
                    </div>
                    {service.paymentPlan !== '1' && (
                      <div className="flex justify-between text-[#2c0e45]">
                        <span>Per Payment:</span>
                        <span>${(calculateServiceTotal(service) / parseInt(service.paymentPlan)).toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-base font-bold mb-3 text-[#2c0e45]">LOCATION</label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="border-2 border-[#2c0e45] h-12">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((loc) => (
                <SelectItem key={loc.name} value={loc.name}>
                  {loc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedServices.length > 0 && location && (
          <div className="mt-8 space-y-4 bg-white p-6 rounded-lg text-[#2c0e45] border-2 border-[#2c0e45] shadow-lg">
            <div className="text-xl font-bold border-b border-[#2c0e45] pb-4">
              Summary
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax ({location === 'Queens' ? '4.5%' : '0%'}):</span>
                <span>${calculateTax().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-4 border-t border-[#2c0e45]">
                <span>Total:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LaserPackageCalculator;
