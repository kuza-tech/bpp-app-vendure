import { PluginCommonModule, VendurePlugin } from "@vendure/core"
import { zeroDollarPaymentEligibilityChecker } from "./config/zero-dollar-payment-eligibility-checker"
import { zeroDollarPaymentMethodHandler } from "./config/zero-dollar-payment-handler"


/**
 * @description
 * Configuration options for the Mpesa payments plugin.
 */
export interface ZeroDollarPaymentPluginOptions {
}

@VendurePlugin({
    imports: [PluginCommonModule],
    configuration: config => {
        config.paymentOptions.paymentMethodHandlers.push(
            zeroDollarPaymentMethodHandler,
        )
        return config
    }
})
export class ZeroDollarPaymentPlugin {
    static options: ZeroDollarPaymentPluginOptions

    /**
     * Initializes the plugin
     */
    static init(options: ZeroDollarPaymentPluginOptions) {
        this.options = options
        return ZeroDollarPaymentPlugin
    }
}
