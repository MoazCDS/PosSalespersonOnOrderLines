{
    'name': 'POS Salesperson',
    'version': '17.0.1.0.0',
    'summary': 'Sales person in POS order lines',
    'depends': ['point_of_sale', 'hr'],
    'data': [
        "views/pos_config_view.xml",
        "views/pos_order_view.xml",
    ],
    'assets': {
        'point_of_sale._assets_pos': [
            "cds_pos_salesperson/static/src/**/*",
        ],
    },
    'installable': True,
    'application': False,
}