/** @odoo-module */

import { patch } from "@web/core/utils/patch";
import { Order, Orderline } from "@point_of_sale/app/store/models";

patch(Order.prototype, {
    setSalesperson(empId, empName) {
        this.salesperson_id = empId || null;
        this.salesperson_name = empName || "";
        for (const line of this.get_orderlines()) {
            line.setSalesperson(empId, empName);
        }
    },

    export_as_JSON() {
        const json = super.export_as_JSON(...arguments);
        json.salesperson_id = this.salesperson_id || false;
        return json;
    },

    add_product(product, options) {
        const res = super.add_product(product, options);
        const line = this.get_selected_orderline();
        if (line && this.salesperson_id) {
            line.setSalesperson(this.salesperson_id, this.salesperson_name);
        }
        return res;
    },
});

const _getDisplayData = Orderline.prototype.getDisplayData;

patch(Orderline.prototype, {
    setSalesperson(empId, empName) {
        this.salesperson_id = empId || null;
        this.salesperson_name = empName || "";
    },

    getDisplayData() {
        const data = _getDisplayData.apply(this, arguments);
        data.salesperson_name = this.salesperson_name || "No Salesperson";
        return data;
    },

    export_as_JSON() {
        const json = super.export_as_JSON(...arguments);
        json.salesperson_id = this.salesperson_id || (this.order?.salesperson_id || false);
        return json;
    },
});