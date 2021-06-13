namespace $.$$ {

	const { rem, px } = $mol_style_unit

	$mol_style_define($my_nested, {

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

		List_drop: {
			'@': {
				mol_drop_status: {
					drag: {
						'>': {
							$mol_view: {
								':last-child': {
									boxShadow: `0 1px 0 0px ${$mol_theme.focus}`,
								},
							},
						},
					},
				},
			},
		},

		Trash: {
			padding: $mol_gap.block,
			display: 'block',
		},

		Trash_drop: {
			'@': {
				mol_drop_status: {
					drag: {
						background: {
							color: $mol_theme.hover,
						},
					},
				},
			},
		},
		Task_child_row: {
			height: rem(1),
			border: {
				color: "red",
				radius: $mol_gap.round,
				style: "solid"

			},
		}

	})

}
