/** @odoo-module */

import { patch } from "@web/core/utils/patch";
import { usePos } from "@point_of_sale/app/store/pos_hook";
import { Orderline as OrderlineComponent } from "@point_of_sale/app/generic_components/orderline/orderline";
import { useService } from "@web/core/utils/hooks";
import { ConfirmPopup } from "@point_of_sale/app/utils/confirm_popup/confirm_popup";
import { SelectionPopup } from "@point_of_sale/app/utils/input_popups/selection_popup";
import { _t } from "@web/core/l10n/translation";

const _setup = OrderlineComponent.prototype.setup;

patch(OrderlineComponent.prototype, {
    setup() {
        _setup.apply(this, arguments);
        this.pos = usePos();
        this.popup = useService("popup");
        this.orm = useService("orm");
    },

    async onClickLineSalesperson() {
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
            const line = this.props.line;
            line.setSalesperson(selectedEmployee.id, selectedEmployee.name);
            line.getDisplayData()
        }
    }
});