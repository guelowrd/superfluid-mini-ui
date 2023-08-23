import { PaymentOption } from "@superfluid-finance/widget";

const paymentOptions: PaymentOption[] = [
    {
        chainId: 80001,
        receiverAddress: "0x7BDa037dFdf9CD9Ad261D27f489924aebbcE71Ac",
        superToken: {
            address: "0x42bb40bf79730451b11f6de1cba222f17b87afd7",
        },
        flowRate: {
            amountEther: "12345",
            period: "month",
        },
    },
];

export default paymentOptions;