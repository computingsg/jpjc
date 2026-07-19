/* ============ NOSQL / MONGODB CONTENT DATA (grounded in 9569 syllabus, LO 3.3.6, 3.3.7, 3.3.8) ============ */
const MODULES = [
/* ---------- MODULE 1: WHY NOSQL? ---------- */
{
  id:"why", num:"1", title:"Why NoSQL?",
  lo:"LO 3.3.6: Understand how a NoSQL DBMS addresses the shortcomings of a relational DBMS.",
  learn:`
    <p>A relational database stores data in <strong>tables</strong> with a fixed structure: every record has the same fields, relationships live in separate tables, and queries reassemble information with joins. That design is superb for highly structured, closely related data, but it has shortcomings that <strong>NoSQL</strong> (non-relational) database management systems were built to address:</p>
    <ul>
      <li><strong>Rigid schema.</strong> In a table, every record must fit the same set of columns. Adding a new attribute later means altering the table for all existing rows. A NoSQL document store lets each item carry its own set of fields, so items with different attributes live comfortably in one collection.</li>
      <li><strong>Scaling.</strong> A relational DBMS typically scales <em>vertically</em>: when load grows, you buy one bigger, costlier server. NoSQL systems are designed to scale <em>horizontally</em>: data is distributed across many ordinary servers, and more are added as demand grows.</li>
      <li><strong>Reassembly by joins.</strong> Relationally, one real-world thing (a student with CCAs and results) is spread over several tables and rebuilt with joins. A document database can store the <em>whole object in one document</em>, read or written in a single operation.</li>
    </ul>
    <div class="key"><b>The trade-off:</b> NoSQL gives up some of the relational model's strengths: enforced structure, powerful joins, and strong built-in consistency guarantees. Choosing between SQL and NoSQL means matching the tool to the data and workload, not declaring one the winner.</div>`,
  expanders:[
    {t:"What does 'NoSQL' actually cover?", b:"It is an umbrella term for non-relational systems: document stores (MongoDB), key-value stores, column-family stores and graph databases. This topic uses <b>MongoDB</b>, a document store, since that is the system named in the 9569 lab list, alongside PyMongo."},
    {t:"Duplication is allowed, on purpose", b:"Relational design fights redundancy with normalisation. Document design often accepts some duplication (a student document may embed its CCA names) in exchange for reading everything in one go. That is a deliberate engineering trade, and exam answers score by naming the trade, not by pretending one side is free."}
  ],
  activities:[
   {type:"scenario", tag:"Scenario decision", title:"Match the database to the job",
    cards:[
     {stem:"You are building an app for hawker stalls. Menu items have wildly different attributes: some have spice levels, some halal certification details, some set-meal options, and new attribute types appear every month.",
      role:"Task: Choose the storage approach",
      choices:[
        {t:"A document database where each menu item stores whatever attributes it actually has.", correct:true},
        {t:"One relational table with a column for every attribute seen so far, holding NULL where an item lacks it.", correct:false, whyNot:"That table grows dozens of mostly empty columns, and every newly invented attribute forces an alteration applied to every existing row. The rigid schema is exactly the shortcoming in play here."},
        {t:"A separate relational table for each stall, shaped to fit that stall's own menu.", correct:false, whyNot:"Hundreds of differently shaped tables make cross-stall queries and maintenance impractical, and any stall adding a new attribute still has to alter its own table."}
      ],
      ok:"Varied, evolving attributes are the classic case for a document store: each item carries its own fields, and a new attribute type needs no schema change anywhere. The relational designs either drown in NULL columns or fragment into unmanageable per-stall tables.",
      no:"Look at what varies: the set of attributes itself. Ask which option lets every item describe itself without forcing a structure change on all the others."},
     {stem:"A fintech startup processes interbank transfers. Every debit must have a matching credit, records are uniform, and strict consistency is non-negotiable.",
      role:"Task: Choose the storage approach",
      choices:[
        {t:"A NoSQL system, because financial workloads need the horizontal scaling it provides.", correct:false, whyNot:"Throughput helps nobody if a debit can briefly exist without its credit. The stated non-negotiable is transactional consistency, which is the relational model's home ground."},
        {t:"A NoSQL system, storing each transfer as one flexible document.", correct:false, whyNot:"Transfer records are uniform and tightly related, so schema flexibility solves a problem this data does not have, while giving up the guarantees it needs most."},
        {t:"A relational database, using transactions to keep the debit and credit consistent.", correct:true}
      ],
      ok:"Uniform, highly related records with strict integrity requirements sit squarely in relational territory: transactions guarantee the debit and credit change together. NoSQL's flexibility and scaling address shortcomings this workload does not suffer from.",
      no:"Start from the non-negotiable: every debit needs its matching credit, always. Ask which model was built around that guarantee."}
    ]},
   {type:"match", tag:"Drag &amp; drop", title:"Which shortcoming does each NoSQL strength answer?",
    instr:"Drag each relational shortcoming onto the NoSQL strength that addresses it.",
    tokens:[
      {id:"w1", text:"Adding a new column later forces every existing row to change"},
      {id:"w2", text:"Growth means buying one ever bigger server"},
      {id:"w3", text:"Rebuilding one object means joining many tables"},
      {id:"w4", text:"Readings from different sensors never share the same shape"}
    ],
    targets:[
      {id:"wt1", title:"Schema flexibility", hint:"Items in one collection need not look alike", accept:"w1"},
      {id:"wt2", title:"Horizontal scaling", hint:"Spread the load across many cheap machines", accept:"w2"},
      {id:"wt3", title:"Everything in one place", hint:"All the details of an item live inside a single document", accept:"w3"},
      {id:"wt4", title:"Varied data welcome", hint:"Each entry simply stores whatever it has", accept:"w4"}
    ]}
  ],
  quiz:[
    {type:"mcq", q:"A relational table requires every record to have the same fields. How does a document database address this?",
     opts:["It stores every record as a row in one wide table, with NULL in the unused columns","Documents in the same collection may each carry a different set of key-value pairs","It automatically creates a separate table for every new field that appears","It rejects any data that does not match the collection's declared structure"],
     ans:1, wrongWhy:{0:"Wide tables full of NULLs are the relational workaround, not the NoSQL answer: the rigid schema is still there underneath.",2:"Spawning a table per field would multiply the join problem, the opposite of what a document store does.",3:"Collections declare no required structure to enforce: that is precisely the flexibility being described."}, why:"A collection imposes no fixed schema: one document may have a spice level, another a halal certification, and both belong. Relational workarounds like NULL-filled columns or extra tables keep the underlying rigidity; rejection contradicts flexibility outright."},
    {type:"mcq", q:"A social app's user base doubles every month. Which scaling approach is characteristic of NoSQL systems?",
     opts:["Vertical scaling: replace the server with one much more powerful machine","Normalising the schema to third normal form so queries touch fewer tables","Caching every query result inside the application layer","Horizontal scaling: distribute the data across many ordinary servers"],
     ans:3, wrongWhy:{0:"Buying a single bigger machine is the classic relational route, and it hits a cost and hardware ceiling: the very shortcoming NoSQL targets.",1:"Normalisation reduces redundancy; it does not add capacity when the user base doubles.",2:"Caching helps reads but is bolted on outside the database, and does nothing for write growth."}, why:"NoSQL systems are built to spread data across many inexpensive servers and to keep adding servers as demand grows: horizontal scaling. Vertical scaling is the relational default that gets expensive fast, and normalisation or caching do not add storage capacity."},
    {type:"short", q:"State two shortcomings of a relational DBMS that a NoSQL DBMS addresses, and how it addresses each.",
     model:"Any two: (1) <b>Rigid schema</b>: every row must fit the same columns; documents in a collection may each have their own fields. (2) <b>Vertical scaling</b>: growth needs one bigger server; NoSQL scales horizontally across many ordinary servers. (3) <b>Join-based reassembly</b>: one object is spread over tables and rebuilt with joins; a document stores the whole object, read and written in one operation."}
  ]
},
/* ---------- MODULE 2: DOCUMENTS AND COLLECTIONS ---------- */
{
  id:"documents", num:"2", title:"Documents, Collections &amp; _id",
  lo:"Foundation for LO 3.3.8: MongoDB's building blocks and how they map to relational terms.",
  learn:`
    <p>MongoDB organises data in three layers. A <strong>database</strong> holds <strong>collections</strong>, and a collection holds <strong>documents</strong>. A document is a JSON-like object of <strong>key-value pairs</strong>, written in Python as a dict:</p>
    <pre class="codebox"><span class="cb-t">One document in the students collection</span>
{'_id': 7,
 'name': 'Mei',
 'score': 88,
 'cca': ['band', 'chess']}</pre>
    <p>The rough mapping from relational terms: a <b>table</b> corresponds to a collection, a <b>record</b> (row) to a document, and a <b>field</b> to a key-value pair. The mapping is rough on purpose: unlike rows, two documents in one collection are free to have different keys, and a value can itself be a list or a nested document, like <code>cca</code> above.</p>
    <div class="key"><b>_id:</b> every document has an <code>_id</code> value that is <b>unique within its collection</b>, playing the role a primary key plays in a table. Supply your own, or MongoDB generates one automatically when the document is inserted.</div>
    <p>Embedding the CCA list inside the student is a design choice. Relationally, that data would sit in a separate table linked by a foreign key and be reassembled with a join; the document keeps the whole object together, at the price of some duplication if many students share a CCA.</p>`,
  expanders:[
    {t:"JSON on the page, dict in the program", b:"MongoDB thinks in JSON-like documents (internally a binary form called BSON). PyMongo translates so smoothly that in Python you simply read and write dicts: what you insert_one() is a dict, and what find_one() hands back is a dict."},
    {t:"When to embed, when to reference", b:"Embed data that belongs to one owner and is read together with it (a student's CCA list). Keep a reference (store the other document's _id) when the data is shared or huge. At this level, recognising the trade-off, one read versus duplication, is what questions reward."}
  ],
  activities:[
   {type:"match", tag:"Drag &amp; drop", title:"Map the relational world onto MongoDB",
    instr:"Drag each relational term onto its closest MongoDB counterpart.",
    tokens:[
      {id:"d1", text:"Table"},
      {id:"d2", text:"Record"},
      {id:"d3", text:"Field"},
      {id:"d4", text:"Primary key"}
    ],
    targets:[
      {id:"dt1", title:"Collection", hint:"A named group of related documents", accept:"d1"},
      {id:"dt2", title:"Document", hint:"One JSON-like object describing a single thing", accept:"d2"},
      {id:"dt3", title:"Key-value pair", hint:"A named piece of information inside a document", accept:"d3"},
      {id:"dt4", title:"_id", hint:"Unique within its collection, generated automatically when omitted", accept:"d4"}
    ]}
  ],
  quiz:[
    {type:"mcq", q:"Which option correctly maps the relational terms table, record and field, in that order, to MongoDB?",
     opts:["Collection, document, key-value pair","Database, collection, document","Document, collection, key-value pair","Collection, key-value pair, document"],
     ans:0, wrongWhy:{1:"This shifts everything one layer up: a database contains collections, but a table does not correspond to a whole database.",2:"Reversed at the top: many documents live inside one collection, just as many records live inside one table.",3:"The last two are swapped: a record holds fields, so a document holds key-value pairs, not the other way round."}, why:"A table is a group of records, so it maps to a collection of documents; a record maps to a single document; and each field of the record maps to a key-value pair inside the document."},
    {type:"mcq", q:"Which statement about _id is correct?",
     opts:["_id may be left out of a stored document permanently, because it is an optional convenience field","_id must be an increasing integer that the programmer manages","Every stored document has an _id, unique within its collection, generated if not supplied","Documents that have the same shape share a single _id value"],
     ans:2, wrongWhy:{0:"You may omit it when inserting, but only because MongoDB then generates one: the stored document always ends up with an _id.",1:"Any unique value works, and MongoDB happily generates identifiers itself; the programmer is not obliged to manage a counter.",3:"Sharing would defeat its purpose. _id identifies one document, the way a primary key identifies one record."}, why:"_id is the document's identity: always present in a stored document, unique within its collection, and auto-generated on insertion when the program does not supply one. It plays the primary-key role from the relational world."},
    {type:"short", q:"A student document embeds an array of CCA names, e.g. 'cca': ['band', 'chess']. State one advantage and one disadvantage of this compared with storing CCAs relationally in a separate table.",
     model:"<b>Advantage:</b> the whole student, CCAs included, is read or written in one operation, with no join needed. <b>Disadvantage:</b> the CCA names are duplicated across every student who takes them, so a renamed CCA must be updated in many documents (redundancy), and questions like 'list all members of band' require scanning every student rather than one small table."}
  ]
},
/* ---------- MODULE 3: CONNECTING WITH PYMONGO ---------- */
{
  id:"connecting", num:"3", title:"Connecting with PyMongo",
  lo:"LO 3.3.8: Use a programming language to work with a NoSQL database.",
  learn:`
    <p>MongoDB runs as a separate <strong>server program called mongod</strong>, which listens on <code>localhost</code> port <code>27017</code>, the same client-server idea as the Socket Programming topic, and PyMongo is the client library your Python program uses to talk to it:</p>
    <pre class="codebox"><span class="cb-t">connect.py</span>
import pymongo

client = pymongo.MongoClient('localhost', 27017)
db = client['school']
students = db['students']

students.insert_one({'name': 'Farhan', 'score': 82})
print(students.count_documents({}))</pre>
    <p>Two subscripts do the navigation: <code>client['school']</code> reaches a database and <code>db['students']</code> reaches a collection. Both are <strong>created lazily</strong>: the expressions succeed even if nothing called school exists yet, and the database and collection only come into existence when the first document is written.</p>
    <div class="key"><b>When the connection fails:</b> if no mongod server is listening at the address and port, PyMongo raises <code>ServerSelectionTimeoutError</code> when the program first tries to use the connection: the MongoDB cousin of the refused socket connection.</div>
    <p>In the lab exam, mongod runs on your own machine, so <code>'localhost'</code> and port <code>27017</code> are the values to remember.</p>`,
  expanders:[
    {t:"mongod, mongosh, pymongo: who is who?", b:"<b>mongod</b> is the database server process itself. <b>mongosh</b> is an interactive shell for humans to type commands into. <b>PyMongo</b> is the Python library programs use. Your code only ever needs the last one, but nothing works unless mongod is running."},
    {t:"Why lazy creation is convenient, and a trap", b:"No CREATE DATABASE ceremony: write a document and everything appears. The trap: misspell a name, like client['scho0l'], and instead of an error you silently get a fresh empty database. When a query mysteriously returns nothing, check the spelling of the database and collection names first."}
  ],
  activities:[
   {type:"steps", tag:"Interactive walkthrough", title:"From server to stored document",
    instr:"Step through what happens between starting the server and reading back your first document.",
    left:"mongod &middot; localhost:27017",
    right:"Your Python program",
    steps:[
      {t:"Start the mongod server", d:"In a terminal, the mongod server is started, and its window stays running. That process IS the database, listening on localhost port 27017 and owning the data files on disk.", s:"Listening on 27017", c:"Not started", pipe:""},
      {t:"The program connects", d:"import pymongo, then MongoClient('localhost', 27017). Under the hood this opens a connection to the server: the client-server pattern from Socket Programming, wearing database clothes.", s:"Listening on 27017", c:"MongoClient created", pipe:"Connected &#10003;"},
      {t:"Reach a database, lazily", d:"client['school'] hands back a database object immediately, even if no database called school exists yet. Nothing is created on disk; it is a promise, not a write.", s:"No school database yet", c:"db = client['school']", pipe:"Connected &#10003;"},
      {t:"Reach a collection, lazily", d:"db['students'] behaves the same way: a collection object appears in the program, while the server still has nothing called students.", s:"No students collection yet", c:"students = db['students']", pipe:"Connected &#10003;"},
      {t:"The first write creates everything", d:"insert_one({'name': 'Farhan', 'score': 82}) sends the document to the server. Now the database, the collection and the document all exist, and the document has been given an _id.", s:"school.students: 1 document", c:"insert_one(...) returned", pipe:"document &#8594;"},
      {t:"Read back with a query", d:"find() and find_one() ask the server for matching documents; the results come back to the program as ordinary Python dicts.", s:"school.students: 1 document", c:"find_one(...) holds a dict", pipe:"&#8592; documents"},
      {t:"The wrong port, a familiar error", d:"Connect to port 27018 and no server is listening there, so PyMongo raises ServerSelectionTimeoutError: the same lesson as the refused socket connection. Check that mongod is running, and that the address and port match.", s:"Listening on 27017 only", c:"ServerSelectionTimeoutError", pipe:"&#10007; no listener on 27018"}
    ]},
   {type:"order", tag:"Build the program", title:"Assemble connect.py",
    instr:"Tap the line that comes next, from the first line to the last, to rebuild the program. Wrong taps are counted, so think before you tap.",
    lines:[
      "import pymongo",
      "client = pymongo.MongoClient('localhost', 27017)",
      "db = client['school']",
      "students = db['students']",
      "students.insert_one({'name': 'Farhan', 'score': 82})",
      "print(students.count_documents({}))"
    ]},
   {type:"code", tag:"Python exercise · runs in your browser", title:"Connect and insert your first document",
    task:"A (simulated) mongod server is already running on <code>localhost</code> port <code>27017</code>. Write a program that connects with <code>MongoClient</code>, reaches the database <code>school</code> and its collection <code>students</code>, inserts the document <code>{'name': 'Farhan', 'score': 82}</code>, and prints the number of documents using <code>count_documents({})</code>. Connect to a wrong port and you will meet a genuine ServerSelectionTimeoutError.",
    starter:`import pymongo

# 1. connect with MongoClient('localhost', 27017)
# 2. reach the school database, then the students collection
# 3. insert_one the document {'name': 'Farhan', 'score': 82}
# 4. print count_documents({})
`,
    setup:"",
    check:String.raw`col = _col("school", "students")
if not _CLIENTS:
    __result["feedback"] = "No connection was made. Start with pymongo.MongoClient('localhost', 27017)."
elif not col._docs:
    stray = [(d.name, c.name) for d in _DATABASES.values() for c in d._cols.values() if c._docs]
    if stray:
        __result["feedback"] = "The document landed in " + stray[0][0] + "." + stray[0][1] + ", but the task names database 'school' and collection 'students'. Check the two subscripts."
    else:
        __result["feedback"] = "Connected, but the students collection is still empty. insert_one() the document."
else:
    doc = col._docs[0]
    if doc.get("name") != "Farhan" or doc.get("score") != 82:
        __result["feedback"] = "A document arrived, but it holds " + repr({k: v for k, v in doc.items() if k != "_id"}) + " instead of name Farhan with score 82."
    elif not any(e[0] == "count" for e in col.oplog):
        __result["feedback"] = "Inserted correctly. Finish by printing count_documents({}): note it needs the empty filter {} as its argument."
    else:
        __result["passed"] = True
        __result["feedback"] = "Connected, navigated with two subscripts, inserted, counted. Notice the stored document also gained an _id automatically."`,
    solution:[
      {c:"import pymongo", n:"Bring in the PyMongo library: it is the client your program uses to talk to the mongod server."},
      {c:"client = pymongo.MongoClient('localhost', 27017)", n:"Connect to the server. In the lab, mongod runs on your own machine, so the address is localhost and the port is 27017."},
      {c:"db = client['school']", n:"Reach the school database with a subscript. This succeeds even before school exists: creation is lazy."},
      {c:"students = db['students']", n:"Second subscript reaches the collection. Same laziness: nothing is created yet."},
      {c:"students.insert_one({'name': 'Farhan', 'score': 82})", n:"The first write creates the database, the collection and the document in one go, and MongoDB adds an _id."},
      {c:"print(students.count_documents({}))", n:"count_documents requires a filter argument; the empty dict {} means count everything."}
    ]}
  ],
  quiz:[
    {type:"mcq", q:"A program raises ServerSelectionTimeoutError on its first database operation after MongoClient('localhost', 27018). What is the most likely cause?",
     opts:["The school database has not been created yet","pymongo must be imported again after the client is created","No mongod server is listening at that address and port","The collection is empty, so the client has nothing to bind to"],
     ans:2, wrongWhy:{0:"Databases are created lazily, so a missing database never raises an error: you would simply get an empty one.",1:"One import is all a program ever needs; re-importing changes nothing about connections.",3:"Empty collections are perfectly normal and queryable: emptiness returns no results, not a timeout."}, why:"mongod listens on port 27017; nothing answers on 27018, so the connection times out, just as a socket connection is refused when no server is listening. Missing databases and empty collections never cause this error, because creation is lazy and emptiness is legal."},
    {type:"mcq", q:"client['school'] succeeds even though no database called school exists on the server. Why?",
     opts:["Databases and collections are created lazily, when the first document is written","MongoClient scans the disk and creates the school database immediately","The expression returns None, and the real error surfaces on the next line","school is a reserved database that exists on every MongoDB server"],
     ans:0, wrongWhy:{1:"Nothing touches the disk at this point: reaching a database by name performs no creation at all.",2:"It returns a usable database object, not None; the very next line can reach a collection through it without error.",3:"There are a few system databases, but school is not one of them: it is just an ordinary name the program chose."}, why:"Reaching a database or collection by name is a promise, not a write. The objects work immediately in the program, and the server only creates the database and collection when the first document is inserted."},
    {type:"short", q:"State the role of mongod and the role of MongoClient when a Python program uses MongoDB.",
     model:"<b>mongod</b> is the database server process: it runs separately (listening on localhost port 27017 in the lab), owns the data files and answers requests. <b>MongoClient</b> is the PyMongo object a program creates to connect to that server; through it the program reaches databases and collections, e.g. client['school']['students']."}
  ]
},
/* ---------- MODULE 4: INSERTING AND READING ---------- */
{
  id:"inserting", num:"4", title:"Inserting &amp; Reading Documents",
  lo:"LO 3.3.8: Insert documents and retrieve them with find_one and find.",
  learn:`
    <p>Writing documents comes in two sizes. <code>insert_one(doc)</code> stores a single dict and returns a result whose <code>inserted_id</code> is the new document's <code>_id</code>. <code>insert_many(list_of_docs)</code> stores a whole list in one call, returning <code>inserted_ids</code>:</p>
    <pre class="codebox"><span class="cb-t">Writing</span>
students.insert_many([
    {'name': 'Aisha', 'score': 91},
    {'name': 'Ben',   'score': 76},
    {'name': 'Chen',  'score': 84}])</pre>
    <p>Reading also comes in two sizes. <code>find_one(filter)</code> returns the <strong>first matching document as a dict</strong>, or <code>None</code> when nothing matches. <code>find(filter)</code> returns a <strong>cursor</strong>: an iterable that yields each matching document in turn. A cursor is not a list, but a for loop walks it, and <code>list(...)</code> collects it:</p>
    <pre class="codebox"><span class="cb-t">Reading</span>
one = students.find_one({'name': 'Chen'})
print(one)

for doc in students.find({'score': 84}):
    print(doc['name'])</pre>
    <div class="key"><b>The filter is a dict.</b> <code>{'name': 'Chen'}</code> means: documents whose name equals Chen. The empty filter <code>{}</code> matches everything, and <code>count_documents({})</code> counts the whole collection.</div>`,
  expanders:[
    {t:"Why None, not an error?", b:"find_one returning None lets a program test 'is this record there?' with a simple if statement, no exception handling needed. But it also means forgetting to check for None crashes later, with a TypeError when the code treats None like a dict. Check before you subscript."},
    {t:"Cursors are consumed by iteration", b:"Loop over a cursor twice and the second loop sees nothing: it was drained the first time. When the documents are needed more than once, collect them first with list(...) and reuse the list."}
  ],
  activities:[
   {type:"code", tag:"Python exercise · runs in your browser", title:"Insert many, read one",
    task:"The <code>students</code> collection in the <code>school</code> database starts empty. Use <b>insert_many</b> to add these three students in one call: Aisha with score 91, Ben with score 76, Chen with score 84 (fields <code>name</code> and <code>score</code>). Then use <b>find_one</b> with a filter to fetch Chen's document, and print it.",
    starter:`import pymongo

client = pymongo.MongoClient('localhost', 27017)
students = client['school']['students']

# 1. insert_many the three students in one call
# 2. find_one Chen's document with a filter, and print it
`,
    setup:"",
    check:String.raw`col = _col("school", "students")
docs = {d.get("name"): d for d in col._docs}
want = {"Aisha": 91, "Ben": 76, "Chen": 84}
if not col._docs:
    __result["feedback"] = "The collection is still empty. Build a list of three dicts and pass it to insert_many()."
elif set(docs) != set(want) or any(docs[n].get("score") != s for n, s in want.items()):
    __result["feedback"] = "The collection holds " + repr(sorted([(d.get('name'), d.get('score')) for d in col._docs])) + " but the task needs exactly Aisha 91, Ben 76 and Chen 84, with fields name and score."
elif not any(e[0] == "insert_many" and e[1] == 3 for e in col.oplog):
    __result["feedback"] = "All three students are there, but they were not stored with a single insert_many() call on a list of three documents, which is what the task practises."
else:
    finds = [e for e in col.oplog if e[0] == "find_one" and isinstance(e[1], dict) and e[1]]
    hit = any(_match(docs["Chen"], e[1]) for e in finds)
    if not hit:
        __result["feedback"] = "Stored correctly. Now retrieve Chen with find_one and a filter that matches him, e.g. by name."
    else:
        __result["passed"] = True
        __result["feedback"] = "insert_many for bulk writing, find_one with a filter for a single read: the everyday pair of MongoDB operations."`,
    solution:[
      {c:"import pymongo", n:"The client library, as always."},
      {c:"client = pymongo.MongoClient('localhost', 27017)", n:"Connect to the local server."},
      {c:"students = client['school']['students']", n:"Both subscripts can be chained on one line: database, then collection."},
      {c:"students.insert_many([", n:"insert_many takes ONE argument: a list of documents. The bracket opens that list."},
      {c:"    {'name': 'Aisha', 'score': 91},", n:"Each document is an ordinary dict with the two required fields."},
      {c:"    {'name': 'Ben', 'score': 76},", n:"Commas separate the documents inside the list."},
      {c:"    {'name': 'Chen', 'score': 84}])", n:"Close the list and the call. All three are stored in one operation."},
      {c:"print(students.find_one({'name': 'Chen'}))", n:"The filter dict picks Chen; find_one returns his whole document as a dict, _id included."}
    ]}
  ],
  quiz:[
    {type:"mcq", q:"What does students.find({'house': 'red'}) return?",
     opts:["A list holding every matching document","The first matching document, or None if nothing matches","The number of documents that matched the filter","A cursor that yields each matching document when iterated"],
     ans:3, wrongWhy:{0:"Close, but it is not a list: you must iterate it, or wrap it in list(...) yourself, and it drains after one pass.",1:"That describes find_one, the single-document sibling.",2:"Counting is count_documents' job; find is about retrieving the documents themselves."}, why:"find returns a cursor: a for loop walks the matching documents one by one, and list(...) collects them when a real list is needed. find_one returns a single dict or None, and count_documents returns a number."},
    {type:"mcq", q:"Which call returns None, rather than raising an error, when no student is called Zed?",
     opts:["students.find({'name': 'Zed'})","students.find_one({'name': 'Zed'})","students.insert_one({'name': 'Zed'})","students.count_documents({'name': 'Zed'})"],
     ans:1, wrongWhy:{0:"find never returns None: with no matches it returns an empty cursor, and a loop over it simply runs zero times.",2:"insert_one does not look for Zed; it stores a new document and returns a result with the new _id.",3:"count_documents returns the number 0 for no matches, which is not None."}, why:"find_one is the call with the None convention: first match as a dict, or None when nothing matches, ready for an if check. find gives an empty cursor, count_documents gives 0, and insert_one creates rather than searches."},
    {type:"short", q:"Distinguish insert_one from insert_many, naming the attribute of each call's returned result that reveals the new _id value(s).",
     model:"<b>insert_one(doc)</b> stores a single dict; its result exposes <code>inserted_id</code>, the _id of the new document. <b>insert_many(docs)</b> stores a list of dicts in one call; its result exposes <code>inserted_ids</code>, the list of new _id values in order."}
  ]
},
/* ---------- MODULE 5: QUERY OPERATORS, PROJECTION, SORT ---------- */
{
  id:"querying", num:"5", title:"Queries: Operators, Projection &amp; Sort",
  lo:"LO 3.3.8: Retrieve data, process it and return the processed data as a result.",
  learn:`
    <p>Equality filters only go so far. <strong>Query operators</strong>, written as a nested dict on the field, express comparisons:</p>
    <pre class="codebox"><span class="cb-t">Operators</span>
cars.find({'battery': {'$lt': 20}})        # strictly below 20
cars.find({'battery': {'$gte': 60}})       # 60 or more
cars.find({'model': {'$ne': 'Vios'}})      # not equal
cars.find({'model': {'$in': ['Axia', 'Jazz']}})  # any of these</pre>
    <p>The operators to know: <code>$gt</code>, <code>$gte</code>, <code>$lt</code>, <code>$lte</code>, <code>$ne</code> and <code>$in</code>. Multiple conditions in one filter dict are ANDed: <code>{'available': True, 'battery': {'$gte': 60}}</code> requires both.</p>
    <p>A <strong>projection</strong>, the optional second argument of find and find_one, chooses which fields come back. <code>{'model': 1, 'battery': 1, '_id': 0}</code> keeps only model and battery; note that <code>_id</code> tags along unless explicitly switched off with 0.</p>
    <p>Cursors can be shaped before iteration: <code>.sort('battery', 1)</code> orders ascending, <code>.sort('battery', -1)</code> descending, and <code>.limit(3)</code> caps the number of results:</p>
    <pre class="codebox"><span class="cb-t">Top three healthiest batteries</span>
for car in cars.find({}, {'model': 1, '_id': 0}).sort('battery', -1).limit(3):
    print(car)</pre>`,
  expanders:[
    {t:"Reading a nested filter aloud", b:"{'battery': {'$lt': 20}} reads inside-out: on the field battery, apply the condition less-than 20. The common mistake is inverting the nesting, {'$lt': {'battery': 20}}, which puts the operator at the top level where it has no field to act on."},
    {t:"1 means keep, 0 means hide", b:"Projections normally list the fields to keep, marked 1, and _id must be silenced separately with '_id': 0 because it is included by default. Mixing 1s and 0s for ordinary fields in one projection is not allowed in MongoDB; pick one style."}
  ],
  activities:[
   {type:"match", tag:"Drag &amp; drop", title:"Decode the operators",
    instr:"Drag each operator onto the comparison it performs.",
    tokens:[
      {id:"q1", text:"$gt"},
      {id:"q2", text:"$lte"},
      {id:"q3", text:"$ne"},
      {id:"q4", text:"$in"}
    ],
    targets:[
      {id:"qt1", title:"Strictly above", hint:"Matches values larger than the reference, excluding it", accept:"q1"},
      {id:"qt2", title:"At most", hint:"Matches values up to and including the reference", accept:"q2"},
      {id:"qt3", title:"Anything but", hint:"Matches every value except the reference", accept:"q3"},
      {id:"qt4", title:"One of these", hint:"Matches when the value appears in a given list", accept:"q4"}
    ]},
   {type:"code", tag:"Python exercise · runs in your browser", title:"Find the cars that need charging",
    task:"A car-sharing fleet lives in the <code>cars</code> collection of the <code>jpcar</code> database (already seeded, simulated). Each document has <code>model</code>, <code>battery</code> and <code>available</code>. Build the list <code>low_battery</code>: documents for cars with battery <b>strictly below 20</b>, showing <b>only</b> <code>model</code> and <code>battery</code> (no <code>_id</code>), <b>sorted by battery ascending</b>. Use find with an operator, a projection and a sort, then collect the cursor with <code>list(...)</code>.",
    starter:`import pymongo

cars = pymongo.MongoClient('localhost', 27017)['jpcar']['cars']

# build low_battery: model and battery only, battery < 20,
# sorted ascending by battery
low_battery = []

print(low_battery)
`,
    setup:String.raw`_seed("jpcar", "cars", [
    {"_id": 1, "model": "Axia", "battery": 85, "available": True},
    {"_id": 2, "model": "City", "battery": 15, "available": True},
    {"_id": 3, "model": "Vios", "battery": 8, "available": False},
    {"_id": 4, "model": "Jazz", "battery": 45, "available": True},
    {"_id": 5, "model": "Altis", "battery": 19, "available": True}])`,
    check:String.raw`want = [{"model": "Vios", "battery": 8}, {"model": "City", "battery": 15}, {"model": "Altis", "battery": 19}]
got = __g.get("low_battery")
if not isinstance(got, list):
    __result["feedback"] = "low_battery should be a list. find() returns a cursor: wrap it in list(...) to collect the documents."
elif got == []:
    __result["feedback"] = "low_battery is empty. Filter with the $lt operator nested on the battery field: {'battery': {'$lt': 20}}."
elif any(isinstance(d, dict) and "_id" in d for d in got):
    __result["feedback"] = "The right cars are coming through, but _id is still visible. In the projection, keep model and battery with 1 and switch _id off with '_id': 0."
elif sorted([(d.get("model"), d.get("battery")) for d in got if isinstance(d, dict)]) != sorted([(d["model"], d["battery"]) for d in want]) or any(set(d) != {"model", "battery"} for d in got):
    __result["feedback"] = "low_battery holds " + repr(got) + ". Expected exactly the three cars below 20 (Vios, City, Altis) with only the model and battery fields."
elif got != want:
    __result["feedback"] = "Right cars, right fields, wrong order: " + repr([d.get("model") for d in got]) + ". Sort the cursor by battery ascending with .sort('battery', 1)."
else:
    __result["passed"] = True
    __result["feedback"] = "Operator, projection, sort, list: the full reading pipeline, exactly what Paper 2 data-processing tasks are made of."`,
    solution:[
      {c:"import pymongo", n:"The library, as always."},
      {c:"cars = pymongo.MongoClient('localhost', 27017)['jpcar']['cars']", n:"Connect and chain both subscripts straight to the collection."},
      {c:"cursor = cars.find({'battery': {'$lt': 20}},", n:"First argument, the filter: on the field battery, apply strictly-less-than 20. Operator nested inside the field."},
      {c:"                   {'model': 1, 'battery': 1, '_id': 0})", n:"Second argument, the projection: keep model and battery, and switch off _id, which would otherwise tag along."},
      {c:"cursor = cursor.sort('battery', 1)", n:"Shape the cursor before reading it: 1 sorts ascending, -1 would sort descending."},
      {c:"low_battery = list(cursor)", n:"A cursor is not a list; list(...) walks it and collects the documents."},
      {c:"print(low_battery)", n:"Three documents, lowest battery first, each holding only model and battery."}
    ]}
  ],
  quiz:[
    {type:"mcq", q:"Which filter finds cars whose battery is strictly below 20?",
     opts:["{'battery': {'$lt': 20}}","{'battery' < 20}","{'$lt': {'battery': 20}}","{'battery': {'$lte': 20}}"],
     ans:0, wrongWhy:{1:"That is not valid Python: a dict literal needs key colon value, and comparisons cannot appear in place of a pair.",2:"The nesting is inverted: the operator must sit inside the field's dict, not at the top level of the filter.",3:"So close, but $lte includes 20 itself, and the task says strictly below."}, why:"Operators nest inside the field they test: {'battery': {'$lt': 20}} reads as 'battery, less than 20'. Inverted nesting has no field to act on, and $lte would wrongly include exactly 20."},
    {type:"mcq", q:"What does the projection {'name': 1, '_id': 0} do in a find call?",
     opts:["Sorts the results by name, ignoring _id","Returns only documents that actually contain a name field","Returns each matching document with only its name field, hiding _id","Renames the _id field to name in the results"],
     ans:2, wrongWhy:{0:"Sorting is the cursor's .sort() method; a projection never changes order.",1:"A projection chooses which fields are shown, not which documents match: matching is the filter's job.",3:"No renaming happens anywhere: the two entries independently keep name and hide _id."}, why:"Projections shape each returned document: fields marked 1 are kept, and '_id': 0 is needed because _id is otherwise included by default. They never affect which documents match or their order."},
    {type:"mcq", q:"What does students.find({}).sort('score', -1).limit(3) produce when iterated?",
     opts:["The three lowest scorers, lowest first","The three highest scorers, highest first","Every student, with the top three marked","Three arbitrary students, sorted after they are picked"],
     ans:1, wrongWhy:{0:"-1 sorts descending, so the big scores come first; ascending would be 1.",2:"limit(3) really cuts the results to three; nothing is merely marked.",3:"The sort is applied first, then the limit takes the top of that order, so the three are anything but arbitrary."}, why:"The chain reads left to right: match everything, order by score descending (-1), then keep the first three of that order: the podium, highest first."},
    {type:"short", q:"Write the filter for students in house 'red' with score at least 80, and state how multiple conditions in one filter combine.",
     model:"<code>{'house': 'red', 'score': {'$gte': 80}}</code>. Conditions written in the same filter dict are <b>ANDed</b>: a document must satisfy every one of them to match."}
  ]
},
/* ---------- MODULE 6: UPDATING, DELETING AND CHOOSING ---------- */
{
  id:"updating", num:"6", title:"Updating, Deleting &amp; Choosing SQL vs NoSQL",
  lo:"LO 3.3.7 and 3.3.8: Modify stored data, and explain the applications of SQL and NoSQL.",
  learn:`
    <p>Updates take two arguments: a <strong>filter</strong> choosing which document(s), and an <strong>update document</strong> stating the change using <strong>update operators</strong>:</p>
    <pre class="codebox"><span class="cb-t">Updating</span>
orders.update_one({'item': 'laksa'}, {'$set': {'price': 5.0}})
orders.update_one({'item': 'laksa'}, {'$inc': {'qty': 1}})
orders.update_many({'status': 'unpaid'}, {'$set': {'status': 'paid'}})</pre>
    <p><code>$set</code> writes a value; <code>$inc</code> adds to a number. Passing a plain dict like <code>{'price': 5.0}</code> with no operator is an error: PyMongo insists on operators so a typo cannot silently replace a whole document. The result object reports <code>matched_count</code> (documents the filter found) and <code>modified_count</code> (documents actually changed).</p>
    <p>Deleting mirrors the same one/many pattern: <code>delete_one(filter)</code> removes the first match, <code>delete_many(filter)</code> removes them all, and the result's <code>deleted_count</code> says how many went. Beware <code>delete_many({})</code>: the empty filter matches everything.</p>
    <div class="key"><b>Choosing (LO 3.3.7):</b> SQL suits structured, closely related data needing integrity: banking, inventory with orders, school records tying students to classes. NoSQL suits varied or fast-evolving data at scale: product catalogues with differing attributes, social feeds, sensor and log streams. Name the property of the data, then the database that serves it.</div>`,
  expanders:[
    {t:"matched 1, modified 0: what happened?", b:"The filter found a document, but the update asked for values it already holds, so nothing changed. Distinguishing the two counts is a favourite comprehension check: matched measures the filter, modified measures actual change."},
    {t:"Why not delete and re-insert to 'update'?", b:"It can be made to work, but the document loses its _id stability, any fields you forgot to copy are gone, and between the delete and insert the data simply does not exist. $set changes exactly what you name and leaves everything else, including _id, untouched."}
  ],
  activities:[
   {type:"scenario", tag:"Scenario decision", title:"Fix the failing update",
    cards:[
     {stem:"This line raises ValueError: orders.update_one({'status': 'unpaid'}, {'status': 'paid'})",
      role:"Role: Debugging a teammate's code",
      choices:[
        {t:"Rewrite the filter using $eq, because plain equality is not allowed in filters.", correct:false, whyNot:"Plain equality is exactly what filters allow: the first argument is fine. The complaint is about the second argument, the update document."},
        {t:"Wrap the change in an update operator: {'$set': {'status': 'paid'}}.", correct:true},
        {t:"Replace the call with delete_one followed by insert_one of a corrected document.", correct:false, whyNot:"A heavy workaround: the document briefly ceases to exist, its _id stability is lost, and any field not manually copied is gone. The API asks for an operator, not a rebuild."}
      ],
      ok:"The second argument must state HOW to change the document, using update operators: {'$set': {'status': 'paid'}}. The filter was never the problem, and delete-plus-reinsert risks losing fields and identity for no benefit.",
      no:"Read which argument PyMongo is rejecting: the filter is legal, so look at the update document. One option supplies what the API is asking for."}
    ]},
   {type:"code", tag:"Python exercise · runs in your browser", title:"Review, prune, count",
    task:"The <code>students</code> collection of <code>school</code> is seeded (simulated) with Aisha 91, Ben 58, Chen 84 and Devi 49. Three steps: give Ben <b>5 extra marks</b> after a review using <code>update_one</code> with <b>$inc</b>; then <code>delete_many</code> every student with score <b>below 55</b>; finally store <code>remaining = </code> the number of students left, using <code>count_documents</code>. (After the review, Ben is safe at 63; only Devi goes.)",
    starter:`import pymongo

students = pymongo.MongoClient('localhost', 27017)['school']['students']

# 1. add 5 to Ben's score with update_one and $inc
# 2. delete_many students with score below 55
# 3. remaining = count_documents of what is left
remaining = 0

print(remaining)
`,
    setup:String.raw`_seed("school", "students", [
    {"_id": 1, "name": "Aisha", "score": 91, "house": "red"},
    {"_id": 2, "name": "Ben", "score": 58, "house": "blue"},
    {"_id": 3, "name": "Chen", "score": 84, "house": "red"},
    {"_id": 4, "name": "Devi", "score": 49, "house": "green"}])`,
    check:String.raw`col = _col("school", "students")
by_name = {d.get("name"): d for d in col._docs}
ben = by_name.get("Ben")
used_inc = any(e[0].startswith("update") and isinstance(e[2], dict) and "$inc" in e[2] for e in col.oplog)
if ben is None:
    __result["feedback"] = "Ben has vanished. Add his 5 marks BEFORE the deletion sweep, or 58 falls below the cutoff."
elif ben.get("score") != 63:
    __result["feedback"] = "Ben's score is " + repr(ben.get("score")) + " but should be 63. Use update_one with {'$inc': {'score': 5}} to add to the existing value."
elif not used_inc:
    __result["feedback"] = "Ben is at 63, but not via $inc. The task practises incrementing: let the database do the addition instead of computing 63 yourself with $set."
elif "Devi" in by_name:
    __result["feedback"] = "Devi (49) is still enrolled. delete_many with a filter using $lt on score clears everyone below 55."
elif set(by_name) != {"Aisha", "Ben", "Chen"}:
    __result["feedback"] = "The survivors are " + repr(sorted(by_name)) + " but should be exactly Aisha, Ben and Chen. Check the deletion filter: only scores below 55 should go."
elif __g.get("remaining") != 3:
    __result["feedback"] = "The collection is right, but remaining is " + repr(__g.get("remaining")) + ". Set it from count_documents({}) after the deletion."
else:
    __result["passed"] = True
    __result["feedback"] = "Increment, prune, count: and the order mattered, since deleting first would have taken Ben at 58. Sequencing updates is real data work."`,
    solution:[
      {c:"import pymongo", n:"The client library."},
      {c:"students = pymongo.MongoClient('localhost', 27017)['school']['students']", n:"Connect and reach school.students in one chained line."},
      {c:"students.update_one({'name': 'Ben'}, {'$inc': {'score': 5}})", n:"$inc adds to the stored value: the database turns 58 into 63. $set would need you to know the total yourself."},
      {c:"students.delete_many({'score': {'$lt': 55}})", n:"One call sweeps every match. Run it AFTER the review, so Ben (now 63) is safe and only Devi (49) matches."},
      {c:"remaining = students.count_documents({})", n:"The empty filter counts everyone left. count_documents always needs its filter argument."},
      {c:"print(remaining)", n:"Three survivors: Aisha, Ben and Chen."}
    ]}
  ],
  quiz:[
    {type:"mcq", q:"Why must the change be written as {'$set': {'price': 5.0}} rather than passing {'price': 5.0} directly to update_one?",
     opts:["$set makes the change permanent; without it the change is rolled back","$set is only required the first time a field is created","A plain dict is accepted but silently updates every matching document","Update operators state how to change things; a plain dict is an error"],
     ans:3, wrongWhy:{0:"There is no rollback happening: the call with a plain dict never runs at all, it is rejected up front.",1:"Creating and changing fields both go through $set; its need never expires after the first write.",2:"Nothing silent occurs: PyMongo refuses the plain dict outright, precisely to prevent accidental damage."}, why:"The update document's job is to say HOW to change things, and operators like $set and $inc carry that meaning. PyMongo rejects a bare dict in update_one to stop a typo from acting like a wholesale replacement."},
    {type:"mcq", q:"update_one returns matched_count 1 and modified_count 0. What happened?",
     opts:["No document satisfied the filter","A document matched but already held the requested values","The update failed midway and should be retried","One document was deleted instead of modified"],
     ans:1, wrongWhy:{0:"Then matched_count would be 0 as well; a 1 there proves the filter found its document.",2:"There is no half-applied state signalled here: the operation completed, and simply had nothing to change.",3:"Updates never delete; deleted_count belongs to the delete calls entirely."}, why:"matched_count measures the filter, modified_count measures actual change. Finding a document that already holds the requested values gives exactly this 1 and 0 pair: a successful call that changed nothing."},
    {type:"short", q:"Name one application better served by SQL and one better served by NoSQL, giving the property of the data that drives each choice.",
     model:"<b>SQL:</b> e.g. a bank's accounts and transfers, or school enrolment records: uniform, closely related records where integrity and transactions matter. <b>NoSQL:</b> e.g. an online product catalogue, social media feed or sensor log stream: items whose attributes vary and evolve, arriving at scale, favouring flexible documents and horizontal scaling."}
  ]
}
];

/* ============ FINAL CHALLENGE ============ */
const CHALLENGE = {
  timerMins: 30,
  sectionA: [
    {topic:"Topic 2 and 4 · Documents",
     q:"Which of the following is a valid document to pass to insert_one()?",
     opts:["{'model': 'Axia', 'battery': 85}","['model', 'Axia', 'battery', 85]","('model', 'Axia'), ('battery', 85)","'model: Axia, battery: 85'"],
     ans:0,
     why:"A document is a dict of key-value pairs. The list flattens keys and values into a sequence with no pairing, the tuple pair is not a mapping, and the string is just text: none of them are dicts, and insert_one rejects them."},
    {topic:"Topic 3 · Connecting",
     q:"In client['jpcar']['cars'], the two subscripts reach, in order:",
     opts:["a collection, then a database","the server, then a database","a database, then a collection","a collection, then a document"],
     ans:2,
     why:"Navigation goes down the hierarchy: the client holds databases, a database holds collections. So the first subscript names the jpcar database and the second its cars collection. Documents are only reached by queries, not subscripts."},
    {topic:"Topic 5 · Queries",
     q:"A car-sharing app must list available cars with battery at least 60. Which filter is correct?",
     opts:["{'available': True, 'battery': {'$gte': 60}}","{'available': True, 'battery': {'$gt': 60}}","{'available': {'$in': True}, 'battery': 60}","{'battery': {'$ne': 60}, 'available': True}"],
     ans:0,
     why:"'At least 60' includes 60, which is $gte; conditions in one dict are ANDed, so availability and battery are both required. $gt wrongly excludes exactly 60, $in needs a list, and $ne means 'anything except 60', a different question entirely."},
    {topic:"Topic 6 · Deleting",
     q:"delete_many({}) was run on the orders collection by mistake. What is the result?",
     opts:["An error, since delete_many requires a non-empty filter","Nothing is removed, since an empty filter matches nothing","Only the first matching document is removed","Every document in the collection is deleted"],
     ans:3,
     why:"The empty filter matches every document, and delete_many removes all matches: the collection is emptied. No error protects against it, {} is the opposite of matching nothing, and one-at-a-time is delete_one's behaviour."},
    {topic:"Topic 1 and 6 · Applications",
     q:"Which pairing of application to database type is most appropriate?",
     opts:["Bank transfers: NoSQL; product catalogue with varied attributes: SQL","Bank transfers: SQL; product catalogue with varied attributes: NoSQL","Both suit NoSQL best, since horizontal scaling benefits every workload","Both suit SQL best, since transactional integrity is always the priority"],
     ans:1,
     why:"Transfers are uniform, related and integrity-critical: SQL territory. A catalogue whose items carry different attributes fits flexible documents: NoSQL territory. The blanket answers ignore that the data's properties, not fashion, drive the choice in each case."}
  ],
  sectionB: [
    {topic:"Topic 1 · Why NoSQL (LO 3.3.6)",
     q:"Explain two ways in which a NoSQL DBMS addresses shortcomings of a relational DBMS.",
     scheme:[
       {pt:"Shortcoming 1 named, e.g. rigid schema: every row must fit the same columns, and later changes alter the whole table", m:1},
       {pt:"How NoSQL addresses it, e.g. documents in one collection may each carry their own fields", m:1},
       {pt:"Shortcoming 2 named, e.g. vertical scaling: growth requires one larger, costlier server (or: joins needed to reassemble one object)", m:1},
       {pt:"How NoSQL addresses it, e.g. horizontal scaling across many ordinary servers (or: the whole object stored in a single document)", m:1}
     ]},
    {topic:"Topic 2 · Documents vs tables",
     q:"The document {'name': 'Mei', 'score': 88, 'cca': ['band', 'chess']} is stored in a students collection. Explain how the same data would be stored relationally, and one advantage of the document form.",
     scheme:[
       {pt:"Relationally the repeating cca data moves to a separate table (e.g. StudentCCA), one row per membership", m:1},
       {pt:"The rows link back to the student via a foreign key referencing the student's primary key", m:1},
       {pt:"Reassembling the full student then requires a join across the tables", m:1},
       {pt:"Advantage of the document: the whole object is read or written in one operation (or: members of the pair student-and-CCAs cannot drift apart across tables; or: new fields need no schema change)", m:1}
     ]},
    {topic:"Topic 3, 4 and 5 · Writing PyMongo",
     q:"Write PyMongo statements to: connect to the local server, reach the students collection of the school database, insert one student document, and print how many students score at least 70.",
     scheme:[
       {pt:"pymongo.MongoClient('localhost', 27017)", m:1},
       {pt:"Reach the collection with both subscripts, e.g. client['school']['students']", m:1},
       {pt:"insert_one with a dict document", m:1},
       {pt:"print(... count_documents({'score': {'$gte': 70}})), using $gte, not $gt", m:1}
     ]},
    {topic:"Topic 4, 5 and 6 · Reading results",
     q:"State what each of the following evaluates to: (a) find_one(f) when a document matches, (b) find_one(f) when nothing matches, (c) find(f), (d) delete_many(f).deleted_count.",
     scheme:[
       {pt:"(a) the first matching document, as a Python dict", m:1},
       {pt:"(b) None", m:1},
       {pt:"(c) a cursor that yields each matching document when iterated (not a list)", m:1},
       {pt:"(d) the number of documents that were removed", m:1}
     ]},
    {topic:"Topic 5 and 6 · A working library",
     q:"A library stores loans in MongoDB, each with member, title, due_days and a status field. Outline PyMongo statements to: mark one loan returned; add 7 to one loan's due_days; remove every loan whose status is 'lost'; and produce the loans with due_days below 0, most overdue first.",
     scheme:[
       {pt:"update_one with a filter and {'$set': {'status': 'returned'}}", m:1},
       {pt:"update_one with {'$inc': {'due_days': 7}}, letting the database do the addition", m:1},
       {pt:"delete_many({'status': 'lost'})", m:1},
       {pt:"find with the operator filter {'due_days': {'$lt': 0}}", m:1},
       {pt:"sorted ascending on due_days with .sort('due_days', 1), so the most negative, most overdue, comes first", m:1}
     ]}
  ],
  sectionC: {
    topic:"Topics 3 to 6 · Canteen orders workflow",
    marks: 9,
    q:"Run the canteen's daily data workflow.",
    task:"The <code>orders</code> collection of the <code>canteen</code> database is seeded (simulated) with five orders, each holding <code>item</code>, <code>price</code>, <code>qty</code> and <code>status</code>. Complete the whole workflow: <b>connect</b> and reach the collection; <b>insert</b> a new order: kaya toast, price 2.0, qty 2, status 'unpaid'; <b>update</b> the chicken rice order's status to 'paid' using update_one with $set; <b>delete</b> every cancelled order with one call; finally build <code>big_orders</code>: a list of the remaining documents with qty <b>at least 2</b>, sorted by price <b>descending</b>. Press Run to auto-mark: partial credit per criterion, rerun as often as you like before submitting.",
    starter:`import pymongo

# 1. connect; reach the orders collection of the canteen database
# 2. insert the kaya toast order (price 2.0, qty 2, status 'unpaid')
# 3. update_one with $set: chicken rice becomes 'paid'
# 4. delete_many all orders with status 'cancelled'
# 5. big_orders = remaining docs with qty >= 2, sorted by price descending
big_orders = []
`,
    checkOnError: true,
    setup:String.raw`_seed("canteen", "orders", [
    {"_id": 1, "item": "laksa", "price": 4.5, "qty": 2, "status": "paid"},
    {"_id": 2, "item": "chicken rice", "price": 3.5, "qty": 1, "status": "unpaid"},
    {"_id": 3, "item": "nasi lemak", "price": 3.0, "qty": 4, "status": "cancelled"},
    {"_id": 4, "item": "mee goreng", "price": 4.0, "qty": 2, "status": "cancelled"},
    {"_id": 5, "item": "ice milo", "price": 1.5, "qty": 3, "status": "paid"}])`,
    check:String.raw`crit = []
col = _col("canteen", "orders")
items = {d.get("item"): d for d in col._docs}
c1 = 1 if (_CLIENTS and (col._docs or col.oplog)) else 0
crit.append(["Connected and reached canteen.orders", c1, 1])
kt = items.get("kaya toast")
c2 = 0
if kt is not None:
    c2 = 2 if (kt.get("price") == 2.0 and kt.get("qty") == 2 and kt.get("status") == "unpaid") else 1
crit.append(["New kaya toast order inserted with price, qty and status", c2, 2])
cr = items.get("chicken rice")
used_set = any(e[0] == "update_one" and isinstance(e[2], dict) and "$set" in e[2] for e in col.oplog)
c3 = 0
if cr is not None and cr.get("status") == "paid":
    c3 = 2 if used_set else 1
crit.append(["Chicken rice marked paid via update_one with $set", c3, 2])
cancelled_left = [d for d in col._docs if d.get("status") == "cancelled"]
used_dm = any(e[0] == "delete_many" for e in col.oplog)
c4 = 0
if not cancelled_left and "laksa" in items and "ice milo" in items:
    c4 = 2 if used_dm else 1
crit.append(["All cancelled orders removed in one delete_many, others intact", c4, 2])
want = ["laksa", "kaya toast", "ice milo"]
got = __g.get("big_orders")
c5 = 0
if isinstance(got, list) and got and all(isinstance(d, dict) for d in got):
    names = [d.get("item") for d in got]
    if names == want:
        c5 = 2
    elif sorted(names) == sorted(want):
        c5 = 1
crit.append(["big_orders: qty at least 2, sorted by price descending", c5, 2])
marks = c1 + c2 + c3 + c4 + c5
__result["marks"] = marks
__result["crit"] = crit
fb = []
if __result["error"]:
    fb.append("The program stopped with an error before finishing; marks were awarded for what it completed.")
if marks == 9:
    fb.append("Full marks: insert, targeted update, bulk delete and an operator query with a sort, one complete data workflow.")
__result["feedback"] = " ".join(fb)
__result["passed"] = marks == 9`,
    solution:[
      {c:"import pymongo", n:"The client library."},
      {c:"client = pymongo.MongoClient('localhost', 27017)", n:"Connect to the local mongod server: localhost, port 27017."},
      {c:"orders = client['canteen']['orders']", n:"Database subscript, then collection subscript."},
      {c:"orders.insert_one({'item': 'kaya toast', 'price': 2.0,", n:"A new order is just a dict; insert_one stores it and generates its _id."},
      {c:"                   'qty': 2, 'status': 'unpaid'})", n:"All four fields the workflow requires, matching the seeded documents' shape."},
      {c:"orders.update_one({'item': 'chicken rice'},", n:"First argument: the filter choosing which document to touch."},
      {c:"                  {'$set': {'status': 'paid'}})", n:"Second argument: HOW to change it. $set writes the new status and leaves every other field alone."},
      {c:"orders.delete_many({'status': 'cancelled'})", n:"One call removes every match: both cancelled orders go at once."},
      {c:"cursor = orders.find({'qty': {'$gte': 2}})", n:"'At least 2' includes 2 itself, so the operator is $gte, not $gt."},
      {c:"big_orders = list(cursor.sort('price', -1))", n:"-1 sorts descending, priciest first, and list(...) collects the cursor into a real list."}
    ]
  }
};
