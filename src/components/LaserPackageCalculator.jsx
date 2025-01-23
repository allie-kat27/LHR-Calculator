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
  'Touch Up 3+1': { sessions: 4, totalMultiplier: 3 }
};

const locations = [
  { name: 'Queens', taxRate: 0.045 },
  { name: 'Long Island', taxRate: 0 }
];

const LaserPackageCalculator = () => {
  const [services, setServices] = useState([]);
  const [location, setLocation] = useState(null);
  const [showServiceSelect, setShowServiceSelect] = useState(false);

  const addService = (serviceName) => {
    const categoryInfo = Object.entries(serviceCategories).find(([_, data]) => 
      data.services.includes(serviceName)
    );
    
    if (categoryInfo) {
      setServices([...services, {
        service: serviceName,
        price: categoryInfo[1].price,
        packageType: null,
        payments: null
      }]);
      setShowServiceSelect(false);
    }
  };

  const removeService = (index) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const updateService = (index, field, value) => {
    const updatedServices = [...services];
    updatedServices[index] = {
      ...updatedServices[index],
      [field]: value
    };

    if (field === 'packageType') {
      const isTouch = value.includes('Touch Up');
      const currentPayments = updatedServices[index].payments;
      if (currentPayments && isTouch && currentPayments > 2) {
        updatedServices[index].payments = null;
      }
    }

    setServices(updatedServices);
  };

  const getPaymentOptions = (packageType) => {
    if (!packageType) return [];
    if (packageType.includes('Touch Up')) {
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
    if (!service.payments) return 0;
    const total = calculateServiceTotal(service);
    return total / service.payments;
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
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-base font-bold text-[#2c0e45]">
              TREATMENT AREA(S)
            </label>
            <Button 
              onClick={() => setShowServiceSelect(true)}
              className="bg-[#e91f4e] hover:bg-[#c41840] text-white flex items-center gap-2 px-4 py-2 rounded-full"
            >
              <Plus size={20} /> Add Service
            </Button>
          </div>

          {showServiceSelect && (
            <Select onValueChange={addService}>
              <SelectTrigger className="border-2 border-[#2c0e45] h-12 w-full rounded-lg bg-white">
                <div className="flex justify-between items-center w-full">
                  <SelectValue placeholder="Select treatment area" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-[#2c0e45] rounded-lg">
                {Object.entries(serviceCategories).map(([category, { services }]) => (
                  <div key={category} className="p-2">
                    <div className="font-bold text-[#2c0e45] pb-2 border-b border-[#2c0e45]">
                      {category}
                    </div>
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

        {services.map((service, index) => (
          <div key={index} className="bg-white p-4 rounded-lg border-2 border-[#2c0e45] space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-[#2c0e45]">{service.service}</span>
              <Button 
                onClick={() => removeService(index)}
                className="bg-[#e91f4e] hover:bg-[#c41840] text-white px-4 py-2 rounded-full"
              >
                Remove
              </Button>
            </div>

            <Select
              value={service.packageType}
              onValueChange={(value) => updateService(index, 'packageType', value)}
            >
              <SelectTrigger className="border-2 border-[#2c0e45] h-12">
                <div className="flex justify-between items-center w-full">
                  <SelectValue placeholder="Select package type" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {Object.keys(packageTypes).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {service.packageType && (
              <Select
                value={service.payments}
                onValueChange={(value) => updateService(index, 'payments', parseInt(value))}
              >
                <SelectTrigger className="border-2 border-[#2c0e45] h-12">
                  <div className="flex justify-between items-center w-full">
                    <SelectValue placeholder="Select payment plan" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {getPaymentOptions(service.packageType).map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        ))}

        {services.length > 0 && services.every(s => s.packageType && s.payments) && (
          <div>
            <label className="block text-base font-bold mb-3 text-[#2c0e45]">LOCATION</label>
            <Select onValueChange={setLocation}>
              <SelectTrigger className="border-2 border-[#2c0e45] h-12">
                <div className="flex justify-between items-center w-full">
                  <SelectValue placeholder="Select location" />
                </div>
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
        )}

        {location && services.length > 0 && services.every(s => s.packageType && s.payments) && (
          <div className="mt-8 bg-white p-6 rounded-lg text-[#2c0e45] border-2 border-[#2c0e45] shadow-lg">
            <div className="grid grid-cols-3 gap-8">
              <div className="font-bold text-lg pb-4 border-b-2 border-[#2c0e45]">Total Package Price</div>
              <div className="font-bold text-lg pb-4 border-b-2 border-[#2c0e45]">Price Per Treatment</div>
              <div className="font-bold text-lg pb-4 border-b-2 border-[#2c0e45]">Price Per Payment</div>

              {services.map((service, index) => (
                <React.Fragment key={index}>
                  <div className="py-2">
                    {service.service}: ${calculateServiceTotal(service).toFixed(2)}
                  </div>
                  <div className="py-2">
                    {service.service}: ${calculatePricePerTreatment(service).toFixed(2)}
                  </div>
                  <div className="py-2">
                    {service.service}: ${calculatePaymentAmount(service).toFixed(2)}
                  </div>
                </React.Fragment>
              ))}

              <div className="pt-4 border-t-2 border-[#2c0e45] font-bold">
                Subtotal: ${calculateSubtotal().toFixed(2)}
                {location === 'Queens' && (
                  <div>Tax: ${calculateTax().toFixed(2)}</div>
                )}
                <div>Total: ${calculateTotal().toFixed(2)}</div>
              </div>
              <div className="pt-4 border-t-2 border-[#2c0e45] font-bold">
                Total: ${(calculateTotal() / services.reduce((sum, s) => sum + packageTypes[s.packageType].sessions, 0)).toFixed(2)}
              </div>
              <div className="pt-4 border-t-2 border-[#2c0e45] font-bold">
                Total: ${(calculateTotal() / services.reduce((max, s) => Math.max(max, s.payments), 1)).toFixed(2)}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LaserPackageCalculator;
