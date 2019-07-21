xtag.create('x-books', class extends XTagElement {
	name (){ return 'books'; }
	list () {
		return [
			{
				"book_id": "123",
				"book_name": "三国演义",
				"author": "罗贯中",
				"publisher": "清华大学出版社",
				"publish_date": "1980-01-22",
				"price": "129.12",
				"sum": "12"
			},
			{
				"book_id": "1234",
				"book_name": "西游记",
				"author": "吴承恩",
				"publisher": "tsinghua",
				"publish_date": "1980-12-01",
				"price": "120.12",
				"sum": "10"
			}
		];
	}
	'::template(true)' (){
		let list = this.list();
		// let list = listData;
		return `
		<table class="table table-striped table-bordered">
			<tbody id="tbody">
			${list.map((item, i) => `
				<tr data-key="${ item.book_id }">
					<td>${ i }</td>
					<td>${item.book_id }</td>
					<td>${item.book_name }</td>
					<td>${item.author }</td>
					<td>${item.publisher }</td>
					<td>${item.publish_date }</td>
					<td>
						<a title="View" aria-label="View" data-pjax="0" data-id="${item.book_id }" id="view">
							<span class="glyphicon glyphicon-eye-open"></span>
						</a>
						<a title="Update" aria-label="Update" data-pjax="0" data-id="${item.book_id }" id="update">
							<span class="glyphicon glyphicon-pencil"></span>
						</a>
						<a title="Delete" aria-label="Delete" data-pjax="0" data-id="${item.book_id }" id="delete">
							<span class="glyphicon glyphicon-trash"></span>
						</a>
					</td>
				</tr>
				`).join('')}
			</tbody>
		</table>
		`;
	}
});