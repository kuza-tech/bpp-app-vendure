import { FulfillmentHandler, LanguageCode, OrderLine, TransactionalConnection } from '@vendure/core';
import { In } from 'typeorm';

let connection: TransactionalConnection;

/**
 * @description
 * This is a fulfillment handler for digital products which generates a download url
 * for each digital product in the order.
 */
export const digitalFulfillmentHandler = new FulfillmentHandler({
    code: 'digital-fulfillment',
    description: [
        {
            languageCode: LanguageCode.en,
            value: 'Generates product keys for the digital download',
        },
    ],

    args: {},
    init: injector => {
        connection = injector.get(TransactionalConnection);
    },
    createFulfillment: async (ctx, orders, lines) => {
        const digitalDownloadUrls: string[] = [];
	const topicTitles: string[] = [];
        const topicDescriptions: string[] = [];
        const topicStatuses: string[] = [];
	const topicDurations: string[] = [];
        const topicPosterImages: string[] = [];
        const completionCertificateUrl: string = "";

        const orderLines = await connection.getRepository(ctx, OrderLine).find({
            where: {
                id: In(lines.map(l => l.orderLineId)),
            },
            relations: {
                productVariant: true,
            },
        });
        for (const orderLine of orderLines) {
            if (orderLine.productVariant.customFields.isDigital) {
                // This is a digital product, so generate a download url
                const mediaUrls= (orderLine.productVariant.customFields as any).mediaUrl;
                for (const mediaUrl of mediaUrls){
                    if(mediaUrl != null){
                        digitalDownloadUrls.push(mediaUrl);
                    }
                }
		                
                //const downloadUrl = await generateDownloadUrl(orderLine);
                //digitalDownloadUrls.push(downloadUrl);

		// This is a digital product, so generate a titles
                const titles= (orderLine.productVariant.customFields as any).titles;
                for (const title of titles){
                    if(title != null){
                        topicTitles.push(title);
                    }
                }
                // This is a digital product, so generate descriptions
                const descriptions= (orderLine.productVariant.customFields as any).descriptions;
                for (const description of descriptions){
                    if(description != null){
                        topicDescriptions.push(description);
                    }
                }
                // This is a digital product, so generate a titles
                const statuses= (orderLine.productVariant.customFields as any).statuses;
                for (const status of statuses){
                    if(status != null){
                        topicStatuses.push(status);
                    }
                }
		// This is a digital product, so generate a titles
                const durations= (orderLine.productVariant.customFields as any).durations;
                for (const duration of durations){
                    if(duration != null){
                        topicDurations.push(duration);
                    }
                }
                // This is a digital product, so generate a titles
                const posterImages= (orderLine.productVariant.customFields as any).posterImages;
                for (const posterImage of posterImages){
                    if(posterImage != null){
                        topicPosterImages.push(posterImage);
                    }
                }
            }
        }
        return {
            method: 'Digital Fulfillment',
            trackingCode: 'DIGITAL',
            customFields: {
                downloadUrls: digitalDownloadUrls,
		titles: topicTitles,
                descriptions: topicDescriptions,
                statuses: topicStatuses,
		durations: topicDurations,
		posterImages: topicPosterImages,
            },
        };
    },
});

function generateDownloadUrl(orderLine: OrderLine) {
    var downloadUrl = '';
    if((orderLine.productVariant.customFields as any).mediaUrl != null) {
        downloadUrl = (orderLine.productVariant.customFields as any).mediaUrl
    }
    return Promise.resolve(downloadUrl);
}
