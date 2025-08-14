from odoo import models, fields

class PosOrder(models.Model):
    _inherit = 'pos.order'

    salesperson_id = fields.Many2one("hr.employee", string="Salesperson")

    def _order_fields(self, ui_order):
        vals = super()._order_fields(ui_order)
        if ui_order.get('salesperson_id'):
            vals['salesperson_id'] = ui_order['salesperson_id']
        return vals