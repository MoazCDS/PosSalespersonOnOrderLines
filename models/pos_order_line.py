from odoo import models, fields

class PosOrderLine(models.Model):
    _inherit = 'pos.order.line'

    salesperson_id = fields.Many2one("hr.employee", string="Salesperson")

    def _order_line_fields(self, line, session_id=None):
        vals = super()._order_line_fields(line, session_id=session_id)

        if isinstance(line, dict):
            data = line
        elif isinstance(line, (list, tuple)) and line and isinstance(line[-1], dict):
            data = line[-1]
        else:
            data = {}

        sp_id = data.get("salesperson_id")
        if sp_id:
            if isinstance(vals, dict):
                vals["salesperson_id"] = sp_id
            elif isinstance(vals, (list, tuple)) and len(vals) > 2 and isinstance(vals[2], dict):
                vals[2]["salesperson_id"] = sp_id
            else:
                vals = [0, 0, {"salesperson_id": sp_id}]

        return vals
