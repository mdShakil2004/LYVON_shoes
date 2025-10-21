import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../AppIcon';

const CheckoutProgress = ({ 
  currentStep = 1, 
  totalSteps = 4,
  steps = [
    { id: 1, label: 'Cart', icon: 'ShoppingBag' },
    { id: 2, label: 'Shipping', icon: 'Truck' },
    { id: 3, label: 'Payment', icon: 'CreditCard' },
    { id: 4, label: 'Confirmation', icon: 'CheckCircle' }
  ],
  onStepClick,
  allowStepNavigation = false
}) => {
  
  const handleStepClick = (stepId) => {
    if (allowStepNavigation && stepId <= currentStep && onStepClick) {
      onStepClick(stepId);
    }
  };

  const getStepStatus = (stepId) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'upcoming';
  };

  const getStepClasses = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-success-foreground border-success';
      case 'current':
        return 'bg-accent text-accent-foreground border-accent';
      case 'upcoming':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getConnectorClasses = (stepId) => {
    return stepId < currentStep ? 'bg-success' : 'bg-border';
  };

  return (
    <div className="w-full bg-card border-b border-border">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link 
              to="/homepage" 
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              <Icon name="ArrowLeft" size={20} />
              <span className="text-sm font-medium">Continue Shopping</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Shield" size={16} className="text-success" />
            <span>Secure Checkout</span>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="relative">
          <div className="flex items-center justify-between">
            {steps?.map((step, index) => {
              const status = getStepStatus(step?.id);
              const isClickable = allowStepNavigation && step?.id <= currentStep;
              
              return (
                <div key={step?.id} className="flex items-center">
                  {/* Step Circle */}
                  <div className="relative flex flex-col items-center">
                    <button
                      onClick={() => handleStepClick(step?.id)}
                      disabled={!isClickable}
                      className={`
                        w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200
                        ${getStepClasses(status)}
                        ${isClickable ? 'cursor-pointer hover:scale-105' : 'cursor-default'}
                        focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2
                      `}
                    >
                      {status === 'completed' ? (
                        <Icon name="Check" size={16} />
                      ) : (
                        <Icon name={step?.icon} size={16} />
                      )}
                    </button>
                    
                    {/* Step Label */}
                    <span className={`
                      mt-2 text-xs font-medium text-center
                      ${status === 'current' ? 'text-accent' : 
                        status === 'completed' ? 'text-success' : 'text-muted-foreground'}
                    `}>
                      {step?.label}
                    </span>
                  </div>
                  {/* Connector Line */}
                  {index < steps?.length - 1 && (
                    <div className="flex-1 mx-4">
                      <div className={`
                        h-0.5 transition-colors duration-300
                        ${getConnectorClasses(step?.id)}
                      `} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Step Info */}
        <div className="mt-6 text-center">
          <h2 className="text-lg font-semibold text-foreground">
            Step {currentStep} of {totalSteps}: {steps?.find(s => s?.id === currentStep)?.label}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {currentStep === 1 && "Review your items and proceed to shipping"}
            {currentStep === 2 && "Enter your shipping information"}
            {currentStep === 3 && "Choose your payment method"}
            {currentStep === 4 && "Review and confirm your order"}
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="flex items-center justify-center space-x-6 mt-6 pt-4 border-t border-border">
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Icon name="Lock" size={14} className="text-success" />
            <span>SSL Encrypted</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Icon name="Shield" size={14} className="text-success" />
            <span>Secure Payment</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Icon name="Truck" size={14} className="text-success" />
            <span>Free Returns</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutProgress;