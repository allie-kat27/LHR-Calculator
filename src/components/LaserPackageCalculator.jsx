'use client';
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
  'Standard 6': { sessions: 6, totalMultiplier: 6 },
  '6+1 Standard': { sessions: 7, totalMultiplier: 6 },
  'Unlimited': { sessions: 12, discount: 0.25 },
  'Touch Up 3': { sessions: 3, totalMultiplier: 3 },
  'Touch Up 3+1': { sessions: 4, totalMultiplier: 3 },
  'BOGO 20': { sessions: 6, isBogo: true }
};

const locations = [
  { name: 'Queens', taxRate: 0.045 },
  { name: 'Long Island', taxRate: 0 }
];

const paymentOptions = [
  { value: 1, label: 'Upfront' },
  { value: 2, label: '2 installments' },
  { value: 4, label: '4 installments' },
  { value: 6, label: '6 installments' }
];

const LaserPackageCalculator = () => {
  const [services, setServices] = useState([]);
  const [location, setLocation] = useState(null);
  const [payments, setPayments] = useState(null);
  const [showServiceSelect, setShowServiceSelect] = useState(false);

  const addService = (serviceName) => {
    const categoryInfo = Object.entries(serviceCategories).find(([_, data]) => 
      data.services.includes(serviceName)
    );

    if (categoryInfo) {
      setServices([...services, {
        service: serviceName,
        price: categoryInfo[1].price,
        packageType: null
      }]);
      setShowServiceSelect(false);
    }
  };

  const removeService = (index) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const updateService = (index, packageType) => {
    const updatedServices = [...services];
    updatedServices[index] = {
      ...updatedServices[index],
      packageType
    };
    setServices(updatedServices);
  };

  const isReadyForPayment = () => {
    return services.length > 0 && services.every(s => s.packageType);
  };

  const calculateServiceTotal = (service, allServices) => {
    if (!service.packageType) return 0;
    const packageInfo = packageTypes[service.packageType];

    if (service.packageType === 'BOGO 20') {
      const bogoServices = allServices.filter(s => s.packageType === 'BOGO 20');

      if (bogoServices.length >= 2) {
        // Sort services by price (highest first)
        const sortedServices = [...bogoServices].sort((a, b) => b.price - a.price);

        // First service is full price, all others get 20% off
        const isHighestPrice = sortedServices[0].service === service.service &&
                              sortedServices.findIndex(s => s.service === service.service) ===
                              bogoServices.findIndex(s => s.service === service.service);

        if (isHighestPrice) {
          return service.price * 6; // Full price for highest
        } else {
          return service.price * 6 * 0.8; // 20% off other services
        }
      } else {
        // If only one BOGO service, charge full price
        return service.price * 6;
      }
    } else if (service.packageType === 'Unlimited') {
      return service.price * packageInfo.sessions * (1 - packageInfo.discount);
    } else if (packageInfo.totalMultiplier) {
      return service.price * packageInfo.totalMultiplier;
    }

    return service.price * packageInfo.sessions;
  };

  const calculatePricePerTreatment = (service, allServices) => {
    if (!service.packageType) return 0;
    const packageInfo = packageTypes[service.packageType];
    const total = calculateServiceTotal(service, allServices);
    return total / packageInfo.sessions;
  };

  const calculatePaymentAmount = (service, allServices) => {
    if (!payments) return 0;
    const total = calculateServiceTotal(service, allServices);
    return total / payments;
  };

  const calculateSubtotal = () => {
    return services.reduce((sum, service) => sum + calculateServiceTotal(service, services), 0);
  };

  const calculateTax = () => {
    if (!location) return 0;
    const loc = locations.find(l => l.name === location);
    return calculateSubtotal() * loc.taxRate;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
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
        <CardTitle className="text-2xl text-center font-bold font-poppins">
          EWC Laser Hair Removal Package Calculator
        </CardTitle>
      </CardHeader>

      <CardContent className="p-8 space-y-8">
        {/* Service Selection Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <label className="text-lg font-bold text-[#2c0e45]">
              SELECT TREATMENT AREA(S)
            </label>
            <Button 
              onClick={() => setShowServiceSelect(true)}
              className="bg-[#e91f4e] hover:bg-[#c41840] text-white flex items-center gap-2 px-6 py-3 rounded-full transition-colors"
            >
              <Plus size={20} /> Add Treatment Area
            </Button>
          </div>

          {showServiceSelect && (
            <div className="w-full bg-white rounded-lg border-2 border-[#2c0e45] p-4">
              <Select onValueChange={addService}>
                <SelectTrigger className="w-full h-12 bg-white border-2 border-[#2c0e45] rounded-lg">
                  <SelectValue placeholder="Select treatment area" />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-[#2c0e45] rounded-lg max-h-[300px] overflow-y-auto">
                  {Object.entries(serviceCategories).map(([category, { services }]) => (
                    <div key={category} className="p-4">
                      <div className="font-bold text-[#2c0e45] pb-2 mb-2 border-b border-[#2c0e45]">
                        {category}
                      </div>
                      {services.map((service) => (
                        <SelectItem 
                          key={service} 
                          value={service}
                          className="text-[#2c0e45] p-3 hover:bg-[#f4f3f6] cursor-pointer rounded-lg my-1"
                        >
                          {service}
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Selected Services List */}
          <div className="space-y-4">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border-2 border-[#2c0e45]">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-medium text-[#2c0e45]">{service.service}</span>
                  <Button 
                    onClick={() => removeService(index)}
                    className="bg-[#e91f4e] hover:bg-[#c41840] text-white px-6 py-2 rounded-full"
                  >
                    Remove
                  </Button>
                </div>

                <Select
                  value={service.packageType}
                  onValueChange={(value) => updateService(index, value)}
                >
                  <SelectTrigger className="w-full h-12 bg-white border-2 border-[#2c0e45] rounded-lg">
                    <SelectValue 
                      defaultValue={service.packageType} 
                      className="text-[#2c0e45]" 
                      placeholder="Package Type" 
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-2 border-[#2c0e45] rounded-lg max-h-[300px] overflow-y-auto">
                    {Object.keys(packageTypes).map((type) => (
                      <SelectItem 
                        key={type} 
                        value={type}
                        className="text-[#2c0e45] p-3 hover:bg-[#f4f3f6] cursor-pointer rounded-lg"
                      >
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Plan Selection */}
        {isReadyForPayment() && (
          <div className="bg-white p-6 rounded-lg border-2 border-[#2c0e45]">
            <label className="block text-lg font-bold mb-4 text-[#2c0e45]">
              SELECT PAYMENT PLAN
            </label>
            <Select onValueChange={(value) => setPayments(parseInt(value))}>
              <SelectTrigger className="w-full h-12 bg-white border-2 border-[#2c0e45] rounded-lg">
                <SelectValue placeholder="Select payment plan" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-[#2c0e45] rounded-lg max-h-[300px] overflow-y-auto">
                {paymentOptions.map((option) => (
                  <SelectItem 
                    key={option.value} 
                    value={option.value}
                    className="text-[#2c0e45] p-3 hover:bg-[#f4f3f6] cursor-pointer rounded-lg"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Location Selection */}
        {payments && (
          <div className="bg-white p-6 rounded-lg border-2 border-[#2c0e45]">
            <label className="block text-lg font-bold mb-4 text-[#2c0e45]">
              SELECT LOCATION
            </label>
            <Select onValueChange={setLocation}>
              <SelectTrigger className="w-full h-12 bg-white border-2 border-[#2c0e45] rounded-lg">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-[#2c0e45] rounded-lg max-h-[300px] overflow-y-auto">
                {locations.map((loc) => (
                  <SelectItem 
                    key={loc.name} 
                    value={loc.name}
                    className="text-[#2c0e45] p-3 hover:bg-[#f4f3f6] cursor-pointer rounded-lg"
                  >
                    {loc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Price Summary */}
        {location && payments && (
          <div className="bg-white p-8 rounded-lg border-2 border-[#2c0e45] shadow-lg">
            <div className="grid grid-cols-3 gap-8">
              <div className="text-xl font-bold pb-4 border-b-2 border-[#2c0e45] text-center text-[#2c0e45]">
                Total Package Price
              </div>
              <div className="text-xl font-bold pb-4 border-b-2 border-[#2c0e45] text-center text-[#2c0e45]">
                Price Per Treatment
              </div>
              <div className="text-xl font-bold pb-4 border-b-2 border-[#2c0e45] text-center text-[#2c0e45]">
                Price Per Payment
              </div>

              {services.map((service, index) => (
                <React.Fragment key={index}>
                  <div className="py-3 text-center">
                    <span className="font-medium">{service.service}:</span> 
                    <span className="text-[#e91f4e] font-bold"> ${calculateServiceTotal(service, services).toFixed(2)}</span>
                    {service.packageType === 'BOGO 20' && services.filter(s => s.packageType === 'BOGO 20').length >= 2 && 
                     service !== services.filter(s => s.packageType === 'BOGO 20')
                                          .sort((a, b) => b.price - a.price)[0] && (
                      <span className="text-[#e91f4e] text-sm ml-1">(20% off)</span>
                    )}
                  </div>
                  <div className="py-3 text-center">
                    <span className="font-medium">{service.service}:</span> 
                    <span className="text-[#2c0e45] font-bold"> ${calculatePricePerTreatment(service, services).toFixed(2)}</span>
                  </div>
                  <div className="py-3 text-center">
                    <span className="font-medium">{service.service}:</span> 
                    <span className="text-[#2c0e45] font-bold"> ${calculatePaymentAmount(service, services).toFixed(2)}</span>
                  </div>
                </React.Fragment>
              ))}

              <div className="pt-4 border-t-2 border-[#2c0e45] text-center">
                <div className="font-medium">Subtotal: <span className="text-[#e91f4e] font-bold">${calculateSubtotal().toFixed(2)}</span></div>
                {location === 'Queens' && (
                  <div className="font-medium">Tax: <span className="text-[#2c0e45] font-bold">${calculateTax().toFixed(2)}</span></div>
                )}
                <div className="text-lg font-bold mt-2 text-[#2c0e45]">Total: ${calculateTotal().toFixed(2)}</div>
              </div>
              <div className="pt-4 border-t-2 border-[#2c0e45] text-center font-bold text-[#2c0e45]">
                Price Per Treatment: ${services.reduce((sum, service) => sum + calculatePricePerTreatment(service, services), 0).toFixed(2)}
              </div>
              <div className="pt-4 border-t-2 border-[#2c0e45] text-center font-bold text-[#e91f4e]">
                Price Per Payment: ${(calculateTotal() / (payments || 1)).toFixed(2)}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LaserPackageCalculator;
