from odoo import models, fields, api

class PosSession(models.Model):
    _inherit = 'pos.session'

    def _pos_ui_models_to_load(self):
        result = super()._pos_ui_models_to_load()
        if self.config_id._get_program_ids():
            result += ['pos.order', 'pos.order.line']
        return result

    def _loader_params_pos_order(self):
        return {
            'search_params': {
                'domain': [('session_id', '=', self.id)],
                'fields': [
                    'id', 'name', 'pos_reference', 'session_id', 'partner_id',
                    'amount_total', 'state', 'salesperson_id',
                ],
                'order': 'id desc',
                'limit': None,
            }
        }

    def _get_pos_ui_pos_order(self, params):
        return self.env['pos.order'].sudo().search_read(
            domain=params['search_params']['domain'],
            fields=params['search_params']['fields'],
            limit=params['search_params']['limit'],
            order=params['search_params'].get('order'),
        )

    def _loader_params_pos_order_line(self):
        return {
            'search_params': {
                'domain': [('order_id.session_id', '=', self.id)],
                'fields': [
                    'id', 'order_id', 'product_id', 'qty', 'price_unit',
                    'price_subtotal', 'price_subtotal_incl', 'discount', 'salesperson_id',
                ],
                'limit': None,
            }
        }

    def _get_pos_ui_pos_order_line(self, params):
        return self.env['pos.order.line'].sudo().search_read(
            domain=params['search_params']['domain'],
            fields=params['search_params']['fields'],
            limit=params['search_params']['limit'],
        )