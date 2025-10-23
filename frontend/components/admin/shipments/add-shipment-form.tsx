"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface ShipmentFormData {
  orderId: string;
  trackingNumber: string;
  carrier: string;
  shippingMethod: "regular_delivery" | "express_delivery" | "pickup_point";
  status: "pending" | "picked_up" | "in_transit" | "out_for_delivery" | "delivered" | "failed" | "returned";
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  estimatedDeliveryDate: string;
  shippingCost: number;
  notes: string;
}

const initialFormData: ShipmentFormData = {
  orderId: "",
  trackingNumber: "",
  carrier: "",
  shippingMethod: "regular_delivery",
  status: "pending",
  shippingAddress: {
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Bangladesh",
  },
  estimatedDeliveryDate: "",
  shippingCost: 0,
  notes: "",
};

export const AddShipmentForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<ShipmentFormData>(initialFormData);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('shippingAddress.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        shippingAddress: {
          ...prev.shippingAddress,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === "shippingCost" ? parseFloat(value) || 0 : value
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateTrackingNumber = () => {
    const prefix = "EVT";
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const trackingNumber = `${prefix}${timestamp}${random}`;
    
    setFormData(prev => ({
      ...prev,
      trackingNumber: trackingNumber
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Replace with actual API call
      console.log("Creating shipment:", formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Shipment created successfully!");
      router.push("/control/shipments");
    } catch (error) {
      console.error("Error creating shipment:", error);
      toast.error("Failed to create shipment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shipment Information */}
        <Card>
          <CardHeader>
            <CardTitle>Shipment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orderId">Order ID *</Label>
              <Input
                id="orderId"
                name="orderId"
                value={formData.orderId}
                onChange={handleInputChange}
                placeholder="Enter order ID"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="trackingNumber">Tracking Number *</Label>
              <div className="flex gap-2">
                <Input
                  id="trackingNumber"
                  name="trackingNumber"
                  value={formData.trackingNumber}
                  onChange={handleInputChange}
                  placeholder="Enter tracking number"
                  required
                />
                <Button type="button" onClick={generateTrackingNumber} variant="outline">
                  Generate
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="carrier">Carrier *</Label>
              <Input
                id="carrier"
                name="carrier"
                value={formData.carrier}
                onChange={handleInputChange}
                placeholder="e.g., Pathao Courier, Steadfast"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="shippingMethod">Shipping Method</Label>
                <Select value={formData.shippingMethod} onValueChange={(value) => handleSelectChange("shippingMethod", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular_delivery">Regular Delivery</SelectItem>
                    <SelectItem value="express_delivery">Express Delivery</SelectItem>
                    <SelectItem value="pickup_point">Pickup Point</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="picked_up">Picked Up</SelectItem>
                    <SelectItem value="in_transit">In Transit</SelectItem>
                    <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="returned">Returned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="estimatedDeliveryDate">Estimated Delivery</Label>
                <Input
                  id="estimatedDeliveryDate"
                  name="estimatedDeliveryDate"
                  type="date"
                  value={formData.estimatedDeliveryDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shippingCost">Shipping Cost (৳) *</Label>
                <Input
                  id="shippingCost"
                  name="shippingCost"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.shippingCost}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Address */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="shippingAddress.fullName">Full Name *</Label>
              <Input
                id="shippingAddress.fullName"
                name="shippingAddress.fullName"
                value={formData.shippingAddress.fullName}
                onChange={handleInputChange}
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shippingAddress.phone">Phone Number *</Label>
              <Input
                id="shippingAddress.phone"
                name="shippingAddress.phone"
                value={formData.shippingAddress.phone}
                onChange={handleInputChange}
                placeholder="+880XXXXXXXXX"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shippingAddress.address">Address *</Label>
              <Textarea
                id="shippingAddress.address"
                name="shippingAddress.address"
                value={formData.shippingAddress.address}
                onChange={handleInputChange}
                placeholder="Enter full address"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="shippingAddress.city">City *</Label>
                <Input
                  id="shippingAddress.city"
                  name="shippingAddress.city"
                  value={formData.shippingAddress.city}
                  onChange={handleInputChange}
                  placeholder="Enter city"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shippingAddress.state">State/Division</Label>
                <Input
                  id="shippingAddress.state"
                  name="shippingAddress.state"
                  value={formData.shippingAddress.state}
                  onChange={handleInputChange}
                  placeholder="Enter state/division"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="shippingAddress.postalCode">Postal Code</Label>
                <Input
                  id="shippingAddress.postalCode"
                  name="shippingAddress.postalCode"
                  value={formData.shippingAddress.postalCode}
                  onChange={handleInputChange}
                  placeholder="Enter postal code"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shippingAddress.country">Country</Label>
                <Input
                  id="shippingAddress.country"
                  name="shippingAddress.country"
                  value={formData.shippingAddress.country}
                  onChange={handleInputChange}
                  placeholder="Bangladesh"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Enter any additional notes about this shipment..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/control/shipments")}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Shipment"}
        </Button>
      </div>
    </form>
  );
};