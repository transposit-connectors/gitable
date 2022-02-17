function run(params) {
  var results = api.run("this.list_issues_for_user", { owner: params.owner });
  for (var i = 0; i < results.length; i++) {
    var reference = results[i].full_name + "#" + results[i].number;
    var id = api.query(
      "select id from this.get_airtable_records where reference='" +
        reference +
        "'",
      { baseID: params.baseID, table: params.table }
    );
    var obj = {
      baseID: params.baseID,
      table: params.table,
      reference: reference,
      title: results[i].title,
      state: results[i].state,
      author: results[i].author,
      type: "issue",
      comments: results[i].comments,
      url: results[i].url,
      updated: results[i].updated,
      created: results[i].created,
      completed: results[i].completed,
      repo: results[i].name,
    };
    if (id.length > 0) {
      results[i].airtable_id = id[0].id;
      obj.recordID = id[0].id;
      // Update the result in the table.
      var r = api.run("this.update_record", obj);
      api.log(r);
    } else {
      results[i].airtable_id = 0;
      var r = api.run("this.create_record", obj);
      api.log(r);
    }
    results[i].reference = reference;
  }
  return {
    results,
  };
}
/*
 * For sample code and reference material, visit
 * https://docs.transposit.com/references/js-operations
 */
