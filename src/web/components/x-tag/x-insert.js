xtag.create('x-insert', class extends XTagElement {
    name (){ return 'insert'; }
    '::template(true)' (){
        return `    
            <p>
                <a class="btn btn-success" id="newAddBook">Create Book</a>    
            </p>
            <table class="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>#</th>
                        <th><a href="/basic/web/index.php?r=book%2Findex&amp;sort=book_id" data-sort="book_id">Book ID</a></th>
                        <th><a href="/basic/web/index.php?r=book%2Findex&amp;sort=book_name" data-sort="book_name">Book Name</a></th>
                        <th><a href="/basic/web/index.php?r=book%2Findex&amp;sort=author" data-sort="author">Author</a></th>
                        <th><a href="/basic/web/index.php?r=book%2Findex&amp;sort=publisher" data-sort="publisher">Publisher</a></th>
                        <th><a href="/basic/web/index.php?r=book%2Findex&amp;sort=publish_date" data-sort="publish_date">Publish Date</a></th>
                        <th class="action-column">&nbsp;</th>
                    </tr>
                    <tr id="w0-filters" class="filters">
                        <td>&nbsp;</td>
                        <td><input type="text" class="form-control" name="new_book_id" value="" id="new_book_id" /></td>
                        <td><input type="text" class="form-control" name="new_book_name" value="" id="new_book_name" /></td>
                        <td><input type="text" class="form-control" name="new_author" value="" id="new_author" /></td>
                        <td><input type="text" class="form-control" name="new_publisher" value="" id="new_publisher" /></td>
                        <td><input type="text" class="form-control" name="new_publish_date" value="" id="new_publish_date" /></td>
                        <td>&nbsp;</td>
                    </tr>
                </thead>
            </table>
            `;
    }
});