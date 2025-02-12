import { PluginCommonModule, VendurePlugin } from "@vendure/core"
import { codEligibilityChecker } from "./config/cod-eligibility-checker"
import { codPaymentMethodHandler } from "./config/cod-handler"


/**
 * @description
 * Configuration options for the Mpesa payments plugin.
 */
export interface CoDPluginOptions {
}

@VendurePlugin({
    imports: [PluginCommonModule],
    configuration: config => {
        config.paymentOptions.paymentMethodHandlers.push(
            codPaymentMethodHandler,
        )
        return config
    }
})
export class CoDPlugin {
    static options: CoDPluginOptions

    /**
     * Initializes the plugin
     */
    static init(options: CoDPluginOptions) {
        this.options = options
        return CoDPlugin
    }
}
