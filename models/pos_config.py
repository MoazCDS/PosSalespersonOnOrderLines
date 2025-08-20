from odoo import fields, models, api
import base64
from io import BytesIO
import qrcode

class PosConfig(models.Model):
    _inherit = 'pos.config'

    salesperson_ids = fields.Many2many('hr.employee')
    qrcode = fields.Char()

    def _loader_params_pos_config(self):
        params = super()._loader_params_pos_config()
        params['search_params']['fields'].append('salesperson_ids')
        params['search_params']['fields'].append('qrcode')
        return params