/** @odoo-module */

import { patch } from "@web/core/utils/patch";
import { Order } from "@point_of_sale/app/store/models";
import { WarningDialog } from "@web/core/errors/error_dialogs";

const _pay = Order.prototype.pay;

patch(Order.prototype, {
    async pay(...args) {
        if (!this.salesperson_id) {
                this.pos.env.services.dialog.add(WarningDialog, {
                title: "Missing Salesperson",
                message: "Please select a salesperson",
            });
            return;
        }

        return await _pay.apply(this, args);
    },
});