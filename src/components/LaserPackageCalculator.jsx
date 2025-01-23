import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
'use client';

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
  'Touch Up 3+1': { sessions: 4, totalMultiplier: 3 }
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

  const hasAnyTouchUpPackage = () => {
    return services.some(s => s.packageType?.includes('Touch Up'));
  };

  const getAvailablePaymentOptions = () => {
    if (hasAnyTouchUpPackage()) {
      return paymentOptions.filter(option => option.value <= 2);
    }
    return paymentOptions;
  };

  const calculateServiceTotal = (service) => {
    if (!service.packageType) return 0;
    const packageInfo = packageTypes[service.packageType];
    if (service.packageType === 'Unlimited') {
      return service.price * packageInfo.sessions * (1 - packageInfo.discount);
    }
    return service.price * packageInfo.totalMultiplier;
  };

  const calculatePricePerTreatment = (service) => {
    if (!service.packageType) return 0;
    const packageInfo = packageTypes[service.packageType];
    const total = calculateServiceTotal(service);
    return total / packageInfo.sessions;
  };

  const calculatePaymentAmount = (service) => {
    if (!payments) return 0;
    const total = calculateServiceTotal(service);
    return total / payments;
  };

  const calculateSubtotal = () => {
    return services.reduce((sum, service) => sum + calculateServiceTotal(service), 0);
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
                  <div className="flex justify-between items-center w-full px-4">
                    <SelectValue placeholder="Select treatment area" className="text-[#2c0e45]" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-[#2c0e45] rounded-lg">
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
                   <div className="flex justify-between items-center w-full px-4">
                     <SelectValue placeholder="Select package type" className="text-[#2c0e45]" />
                   </div>
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
                <div className="flex justify-between items-center w-full px-4">
                  <SelectValue placeholder="Select payment plan" className="text-[#2c0e45]" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-[#2c0e45] rounded-lg">
                {getAvailablePaymentOptions().map((option) => (
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
                <div className="flex justify-between items-center w-full px-4">
                  <SelectValue placeholder="Select location" className="text-[#2c0e45]" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-[#2c0e45] rounded-lg">
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
          <div className="bg-white p-6 rounded-lg border-2 border-[#2c0e45] shadow-lg">
            <div className="grid grid-cols-3 gap-8">
              <div className="text-xl font-bold pb-4 border-b-2 border-[#2c0e45] text-center">
                Total Package Price
              </div>
              <div className="text-xl font-bold pb-4 border-b-2 border-[#2c0e45] text-center">
                Price Per Treatment
              </div>
              <div className="text-xl font-bold pb-4 border-b-2 border-[#2c0e45] text-center">
                Price Per Payment
              </div>

              {services.map((service, index) => (
                <React.Fragment key={index}>
                  <div className="py-3 text-center">
                    {service.service}: ${calculateServiceTotal(service).toFixed(2)}
                  </div>
                  <div className="py-3 text-center">
                    {service.service}: ${calculatePricePerTreatment(service).toFixed(2)}
                  </div>
                  <div className="py-3 text-center">
                    {service.service}: ${calculatePaymentAmount(service).toFixed(2)}
                  </div>
                </React.Fragment>
              ))}

              <div className="pt-4 border-t-2 border-[#2c0e45] text-center font-bold">
                Subtotal: ${calculateSubtotal().toFixed(2)}
                {location === 'Queens' && (
                  <div>Tax: ${calculateTax().toFixed(2)}</div>
                )}
                <div>Total: ${calculateTotal().toFixed(2)}</div>
              </div>
              <div className="pt-4 border-t-2 border-[#2c0e45] text-center font-bold">
                Total: ${(calculateTotal() / services.reduce((sum, s) => sum + packageTypes[s.packageType].sessions, 0)).toFixed(2)}
              </div>
              <div className="pt-4 border-t-2 border-[#2c0e45] text-center font-bold">
                Total: ${(calculateTotal() / payments).toFixed(2)}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LaserPackageCalculator;
