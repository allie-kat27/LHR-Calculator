import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

[Previous constants remain the same]

const LaserPackageCalculator = () => {
  [Previous state and calculation functions remain the same]

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
                className="bg-[#e91f4e] hover:bg-[#c41840] text-white"
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

        [Previous price summary section remains the same]
      </CardContent>
    </Card>
  );
};

export default LaserPackageCalculator;
