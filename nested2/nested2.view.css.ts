namespace $.$$ {

	const { rem, px } = $mol_style_unit

	$mol_style_define($my_nested2, {

		Task_drop: {
			'@': {
				mol_drop_status: {
					drag: {
						boxShadow: `0 -1px 0 0px ${$mol_theme.focus}`,
					},
				},
			},
		},

		$mol_list: {
			padding: $mol_gap.block,
			minWidth: px(15),
			minHeight: px(15),
			border:{
				style: "solid",
				color:"red"
			}
		},

	

		
		
	})

}
