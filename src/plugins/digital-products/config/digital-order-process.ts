import { OrderProcess, OrderService } from '@vendure/core';

import { digitalFulfillmentHandler } from './digital-fulfillment-handler';



let orderService: OrderService;

function generateGUID(): string {
    const timestamp = new Date().getTime();
    const randomNum = Math.floor(Math.random() * 1000000);
    return `${timestamp}-${randomNum}`;
}
/**
 * @description
 * This OrderProcess ensures that when an Order transitions from ArrangingPayment to
 * PaymentAuthorized or PaymentSettled, then any digital products are automatically
 * fulfilled.
 */
export const digitalOrderProcess: OrderProcess<string> = {
	init: injector => {
        orderService = injector.get(OrderService);
    },
    async onTransitionEnd(fromState, toState, data) {
        //If the order total value is 0 and has a digital product, change the payment status to "Settled"
	console.log('onTransitionEnd - fromState: ' + fromState);
        console.log('onTransitionEnd - toState: ' + toState)
        if (
            fromState === 'AddingItems' && (toState === 'ArrangingPayment')
        ) {
            const digitalOrderLines = data.order.lines.filter(l => l.productVariant.customFields.isDigital);	
		console.log('digital order process - digital order lines ' + digitalOrderLines.length);
		if (digitalOrderLines.length >0 && data.order.totalWithTax === 0) {
                /*console.log('Adding payment to order');
                await orderService.addPaymentToOrder(data.ctx, data.order.id,
                    {
                        method: "zero-dollar-payment",
                        metadata: { token: generateGUID(), 
			amount: data.order.totalWithTax,
			}
                    }
                )
		
		let payments = (await orderService.getOrderPayments(data.ctx,data.order.id))
                console.log('Order transitioning from ArrangingPayment to PaymentSettled');
                console.log(payments);
                for (const payment of payments){
                    //await orderService.settlePayment(data.ctx, payment.id); 
		    console.log('Payment Status: ' + payment.state);
                }*/
		console.log('Order Status Before: ' + toState);
		const result = await orderService.transitionToState(data.ctx, data.order.id, "PaymentSettled")	
		console.log('Result: ' + JSON.stringify(result));

            }
        }
        //If the order has digital products and payment status is "Settled", transition the order fulfillment to fulfilled.
        if (
            fromState === 'ArrangingPayment' &&
            (toState === 'PaymentSettled')
        ) {
            const digitalOrderLines = data.order.lines.filter(l => l.productVariant.customFields.isDigital);
            if (digitalOrderLines.length) {
                await orderService.createFulfillment(data.ctx, {
                    lines: digitalOrderLines.map(l => ({ orderLineId: l.id, quantity: l.quantity })),
                    handler: { code: digitalFulfillmentHandler.code, arguments: [] },
                });
            }
	    console.log('Order Status After: ' + toState);
            /*const result = await orderService.transitionToState(data.ctx, data.order.id, "PaymentSettled")
            console.log('Result: ' + JSON.stringify(result));*/

        }
	if (fromState === 'PaymentSettled' && (toState === 'ArrangingPayment')) {
            console.log('Order Status changed from ' + toState + ' to ' + fromState);
        }
    },
};
