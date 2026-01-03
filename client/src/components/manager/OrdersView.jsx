import React, { useContext, useState } from 'react';
import { AppContext } from '../../App';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { toast } from 'sonner';
import { Clock, CheckCircle2, ChefHat, TrendingUp } from 'lucide-react';

const OrdersView = () => {
  const { orders, setOrders } = useContext(AppContext);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    toast.success(`Order #${orderId} status updated to ${newStatus}`);
  };
  
  const getFilteredOrders = () => {
    if (filterStatus === 'all') return orders;
    if (filterStatus === 'active') {
      return orders.filter(o => ['pending', 'confirmed', 'preparing', 'ready'].includes(o.status));
    }
    return orders.filter(o => o.status === filterStatus);
  };
  
  const filteredOrders = getFilteredOrders().sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );
  
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Pending', className: 'status-pending', icon: Clock },
      confirmed: { label: 'Confirmed', className: 'status-confirmed', icon: CheckCircle2 },
      preparing: { label: 'Preparing', className: 'status-preparing', icon: ChefHat },
      ready: { label: 'Ready', className: 'status-ready', icon: TrendingUp },
      completed: { label: 'Completed', className: 'status-completed', icon: CheckCircle2 }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.className} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };
  
  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      pending: 'confirmed',
      confirmed: 'preparing',
      preparing: 'ready',
      ready: 'completed'
    };
    return statusFlow[currentStatus];
  };
  
  const getNextStatusLabel = (currentStatus) => {
    const labels = {
      pending: 'Confirm Order',
      confirmed: 'Start Preparing',
      preparing: 'Mark as Ready',
      ready: 'Complete Order'
    };
    return labels[currentStatus];
  };
  
  const orderCounts = {
    all: orders.length,
    active: orders.filter(o => ['pending', 'confirmed', 'preparing', 'ready'].includes(o.status)).length,
    pending: orders.filter(o => o.status === 'pending').length,
    completed: orders.filter(o => o.status === 'completed').length
  };
  
  return (
    <div className="space-y-6 page-transition">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Order Management</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filter Tabs */}
          <Tabs value={filterStatus} onValueChange={setFilterStatus} className="mb-6">
            <TabsList className="grid grid-cols-4 w-full max-w-2xl">
              <TabsTrigger value="all" className="relative">
                All Orders
                {orderCounts.all > 0 && (
                  <Badge className="ml-2 bg-muted text-muted-foreground">{orderCounts.all}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="active" className="relative">
                Active
                {orderCounts.active > 0 && (
                  <Badge className="ml-2 bg-primary">{orderCounts.active}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="pending" className="relative">
                Pending
                {orderCounts.pending > 0 && (
                  <Badge className="ml-2 bg-warning">{orderCounts.pending}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed
                {orderCounts.completed > 0 && (
                  <Badge className="ml-2 bg-success">{orderCounts.completed}</Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          {/* Orders Grid */}
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <ChefHat className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No orders found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOrders.map(order => (
                <Card 
                  key={order.id} 
                  className={`card-interactive cursor-pointer ${
                    order.status === 'pending' ? 'pulse-glow border-warning' : ''
                  }`}
                  onClick={() => setSelectedOrder(order)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Table #{order.tableNumber}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(order.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Items: {order.items.length}</p>
                      <div className="flex flex-wrap gap-1">
                        {order.items.slice(0, 3).map((item, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {item.quantity}x {item.name}
                          </Badge>
                        ))}
                        {order.items.length > 3 && (
                          <Badge variant="outline" className="text-xs">+{order.items.length - 3} more</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="pt-3 border-t flex items-center justify-between">
                      <span className="font-bold text-xl text-primary">${order.total.toFixed(2)}</span>
                      {order.status !== 'completed' && (
                        <Button 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            updateOrderStatus(order.id, getNextStatus(order.status));
                          }}
                          className="bg-primary"
                        >
                          {getNextStatusLabel(order.status)}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl flex items-center justify-between">
                  <span>Order Details - Table #{selectedOrder.tableNumber}</span>
                  {getStatusBadge(selectedOrder.status)}
                </DialogTitle>
                <DialogDescription>
                  Order placed on {new Date(selectedOrder.timestamp).toLocaleString()}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {/* Customer Info */}
                {(selectedOrder.customerName || selectedOrder.customerPhone) && (
                  <div className="bg-muted rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Customer Information</h4>
                    {selectedOrder.customerName && (
                      <p className="text-sm"><span className="text-muted-foreground">Name:</span> {selectedOrder.customerName}</p>
                    )}
                    {selectedOrder.customerPhone && (
                      <p className="text-sm"><span className="text-muted-foreground">Phone:</span> {selectedOrder.customerPhone}</p>
                    )}
                  </div>
                )}
                
                {/* Order Items */}
                <div>
                  <h4 className="font-semibold mb-3">Order Items</h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-3 rounded-lg border bg-card">
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                          <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Order Total */}
                <div className="bg-muted rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (10%)</span>
                    <span>${(selectedOrder.total * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="h-px bg-border my-2" />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">${(selectedOrder.total * 1.1).toFixed(2)}</span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                {selectedOrder.status !== 'completed' && (
                  <div className="flex gap-3">
                    <Button 
                      className="flex-1 bg-primary"
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, getNextStatus(selectedOrder.status));
                        setSelectedOrder(null);
                      }}
                    >
                      {getNextStatusLabel(selectedOrder.status)}
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersView;
