from odoo import fields, models, api

class PosConfig(models.Model):
    _inherit = 'pos.config'

    salesperson_ids = fields.Many2many('hr.employee')

    def _loader_params_pos_config(self):
        params = super()._loader_params_pos_config()
        params['search_params']['fields'].append('salesperson_ids')
        return params