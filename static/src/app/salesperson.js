/** @odoo-module */

import { usePos } from "@point_of_sale/app/store/pos_hook";
import { ProductScreen } from "@point_of_sale/app/screens/product_screen/product_screen";
import { Component } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";
import { ConfirmPopup } from "@point_of_sale/app/utils/confirm_popup/confirm_popup";
import { SelectionPopup } from "@point_of_sale/app/utils/input_popups/selection_popup";
import { _t } from "@web/core/l10n/translation";


export class SalespersonButton extends Component {
    static template = "point_of_sale.SalespersonButton";

    setup() {
        this.pos = usePos();
        this.popup = useService("popup");
        this.orm = useService("orm");
    }

    async onClickSalesperson() {
        const employees_ids = this.pos.config.salesperson_ids || [];
        if (employees_ids.length === 0) {
            await this.popup.add(ConfirmPopup, {
                title: "Salesperson",
                body: "No salespersons available.",
            });
            return;
        }

        const employees = await this.orm.searchRead(
            "hr.employee",
            [["id", "in", employees_ids]],
            ["id", "name", "work_email", "barcode", "parent_id"]
        );

        const selectionList = employees.map(emp => ({
            id: emp.id,
            label: emp.name,
            item: emp,
        }));

        const { confirmed, payload: selectedEmployee } = await this.popup.add(SelectionPopup, {
            title: _t("Salesperson"),
            list: selectionList,
        });

        if (confirmed) {
            const order = this.pos.get_order();
            const chosenId = selectedEmployee.id
            order.salesperson_id = chosenId;
            order.setSalesperson(selectedEmployee.id, selectedEmployee.name);
            for (const line of order.get_orderlines()) {
                line.getDisplayData()
            }
        }
    }
}


ProductScreen.addControlButton({
    component: SalespersonButton,
    condition: function () {
        return true;
    },
});