/* ============ SOCKET PROGRAMMING CONTENT DATA (grounded in 9569 syllabus, LO 4.1.2, 4.1.3, 4.1.5, 4.1.6) ============ */
const MODULES = [
/* ---------- MODULE 1: WHAT IS A SOCKET? ---------- */
{
  id:"whatis", num:"1", title:"Sharing Data Between Programs",
  lo:"Foundation for LO 4.1.5 and 4.1.6: what a socket is and what each end of one consists of.",
  learn:`
    <p>Suppose two Python programs are running at the same time and one needs to send data to the other. Most operating systems provide a powerful mechanism to do this called <strong>sockets</strong>.</p>
    <div class="key"><b>Core idea:</b> Picture a socket as a <b>pipe</b> between two running programs. The pipe is <b>bidirectional</b> and carries data, represented as <b>bytes</b>, in both directions.</div>
    <p>The kind most often discussed is the <strong>Internet socket</strong>. Internally, Internet sockets deliver data using the same Transmission Control Protocol and Internet Protocol suite (<strong>TCP/IP</strong>) that transmits data over the Internet. This means an Internet socket can deliver data between <em>any</em> two programs, even programs running on different computers, as long as the two computers can reach each other over the network.</p>
    <div class="pipe-diagram" aria-hidden="true">
      <span class="pd-node">Program A</span>
      <span class="pd-pipe"><span class="pd-arrow">bytes &#8594;</span><span class="pd-arrow back">&#8592; bytes</span></span>
      <span class="pd-node">Program B</span>
    </div>
    <p>Two cautions before we write any code:</p>
    <ul>
      <li><strong>Intermediary devices:</strong> data travelling through an Internet socket may pass through multiple routers and other devices on the way. Any of these devices can read or modify the data unless you <strong>encrypt</strong> it first.</li>
      <li><strong>No instant delivery:</strong> networks become congested, so a program may receive only the first half of a message, with the second half arriving some time later. To avoid working with incomplete data we will later define a <strong>protocol</strong> so the start and end of messages can be detected unambiguously.</li>
    </ul>`,
  expanders:[
    {t:"Why can a variable not do this job?", b:"Each running program (process) has its own private memory space managed by the operating system. A variable in one program simply does not exist inside another program, even if both use the same name. Files and the clipboard live outside both programs, which is why those can work on one machine, and sockets go further by working across machines too."},
    {t:"Who can see my bytes on the way?", b:"The simple pipe picture hides the truth: packets hop through routers, gateways and other intermediary devices owned by other people. Treat every unencrypted socket as a postcard, readable and editable in transit. Encryption turns the postcard into a sealed envelope."}
  ],
  activities:[
   {type:"scenario", tag:"Scenario decision", title:"Choose the right mechanism",
    cards:[
     {stem:"Program A runs on your laptop at home. Program B runs on a lab PC in school. A must send live results to B every few seconds while both keep running.",
      role:"Task: Pick the approach that actually works",
      choices:[
        {t:"A writes the results to a file on its own disk and B opens the identical file path on its side.", correct:false, whyNot:"The identical path on the lab PC names a different disk on a different machine. No shared storage exists between the two computers, so nothing A writes ever appears there."},
        {t:"A and B set up an Internet socket connection and A transmits the results through it as bytes.", correct:true},
        {t:"A assigns the results to a Python variable and B reads the variable with the same name.", correct:false, whyNot:"A variable lives inside one program's private memory space. Another program, on any machine, cannot see it, so B would only ever read its own separate variable."}
      ],
      ok:"A file path only names storage on one machine, and a variable lives inside one program's private memory. An Internet socket is built for exactly this: it carries bytes between two running programs across a network using TCP/IP.",
      no:"Think about what each program can actually reach. Files name storage on one machine, and variables live inside one program's memory. Only one option carries data between two running programs across a network."},
     {stem:"Your chat app sends messages through an Internet socket across the public Internet. A classmate warns that other devices sit between the sender and receiver.",
      role:"Task: Respond to the risk correctly",
      choices:[
        {t:"No action needed: the socket is a direct pipe between the two computers, so nothing sits in between.", correct:false, whyNot:"The direct pipe is a simplified illustration. Real traffic passes through routers and other intermediary devices, and any of them can read or modify unprotected data."},
        {t:"Send each message as many small pieces so that no single device ever sees the whole message.", correct:false, whyNot:"Every packet still travels the same path, so a device on that path can collect all the pieces and reassemble the message. Splitting changes nothing about who can read it."},
        {t:"Encrypt the message before sending it through the socket.", correct:true}
      ],
      ok:"The pipe picture is a simplification: packets pass through intermediary devices, and splitting a message does not stop a device on the path from collecting every piece. Encrypting before sending is the protection that works.",
      no:"Trace the path the bytes really take. They hop through devices you do not control, and all the pieces travel the same route. Only one option stops those devices from reading the content."}
    ]}
  ],
  quiz:[
    {type:"mcq", q:"Two Python programs run at the same time on the same computer. Which of these methods of sending data from one program to the other does NOT work?",
     opts:["One program copies the data onto the system clipboard and the other program reads it from the clipboard","One program writes the data into a file readable by everyone and the other program reads that same file","One program assigns the data to a Python variable and the other program reads the variable with the same name","The two programs set up a socket connection and transmit the data through the socket"],
     ans:2, wrongWhy:{0:"The clipboard is managed by the operating system outside both programs, so both can reach it. Clumsy, but it works on one machine.",1:"A file on the shared disk sits outside both programs, so both can open it. Slow and fragile, but it does work on one machine.",3:"This is precisely what sockets are for, and it works whether the programs share a machine or not."}, why:"The clipboard and a shared file both live outside the two programs, so both programs can reach them on one machine, and a socket is built exactly for this job. A variable cannot work: each process has its own private memory, so the second program can never see the first program's variable."},
    {type:"mcq", q:"Which statement about an Internet socket is correct?",
     opts:["Data flows in one direction only, so two sockets are always needed for a conversation","It carries bytes in both directions between programs whose computers can reach each other","It only connects two programs that are running on the same physical machine","It guarantees that every message arrives complete in a single receive operation"],
     ans:1, wrongWhy:{0:"One socket connection is already bidirectional: data sent at either end comes out at the other, in both directions.",2:"Internet sockets use TCP/IP, the same suite that runs the Internet, so the two programs may be on different computers entirely.",3:"Networks can be congested, so data may arrive in pieces. That is exactly why a protocol is needed to detect where messages end."}, why:"A socket is a bidirectional pipe carrying bytes, and because Internet sockets ride on TCP/IP the two programs may be on the same machine or on opposite sides of the world. Nothing is guaranteed about arriving in one piece though, which is why protocols matter later."},
    {type:"short", q:"Define a socket, and state what uniquely identifies each end of a socket connection.",
     model:"A socket is a general mechanism provided by the operating system that lets two running programs communicate by sending <b>bytes</b> in both directions. Each end of a socket is uniquely identified by a combined <b>IP address</b> (which device) and <b>port number</b> (which program on that device)."}
  ]
},
/* ---------- MODULE 2: IP ADDRESSES AND PORTS ---------- */
{
  id:"addressing", num:"2", title:"IP Addresses &amp; Port Numbers",
  lo:"LO 4.1.2: Understand the concepts of IP addressing.",
  learn:`
    <p>Each end of a socket is associated with a running program and is uniquely identified by a combined <strong>IP address</strong> and <strong>port number</strong>. The IP address identifies <em>which device</em> that end of the socket is attached to; the port number identifies <em>which program</em> on that device is using the socket.</p>
    <p><strong>IPv4</strong> addresses have <b>32 bits</b>, usually presented as 4 denary numbers separated by dots, such as <code>10.133.16.165</code>. Each denary number ranges from 0 to 255 inclusive and corresponds to one byte (8 bits) of the address.</p>
    <div class="key"><b>Two special IPv4 addresses:</b><br>&#8226; <code>127.0.0.1</code> refers to the local computer itself (loopback).<br>&#8226; <code>0.0.0.0</code> refers to all IP addresses of the local computer.</div>
    <p><strong>IPv6</strong> addresses have <b>128 bits</b>, presented as 8 groups of 4 hexadecimal digits separated by colons. For compactness, leading zeros may be omitted, and up to one consecutive run of zero-only groups may be replaced with <code>::</code>.</p>
    <p><strong>Port numbers</strong> range from 0 to 65,535. The first 1,024 ports are reserved for specific kinds of programs and should not be used for other purposes; for instance, ports 80 and 443 are reserved for web server programs. The device keeps track of which program is associated with each port and which ports are still free.</p>
    <p>On Windows, <code>netstat -n</code> lists the sockets currently open on your computer, showing the combined IP address and port number of each end. <code>netstat -no</code> additionally reveals the process ID (PID), which you can match to a program in Task Manager.</p>`,
  expanders:[
    {t:"IPv6 shortening, step by step", b:"<code>2001:0db8:0000:0000:0020:0017:0bad:c0de</code> first drops leading zeros in each group to give <code>2001:db8:0:0:20:17:bad:c0de</code>, then replaces the one consecutive run of zero groups to give <code>2001:db8::20:17:bad:c0de</code>. Only one such <code>::</code> run is allowed, otherwise the address would be ambiguous."},
    {t:"Why reserve the first 1,024 ports?", b:"Well-known services need to be findable: a browser can assume a web server answers on 80 or 443 without asking first. Keeping those numbers reserved prevents ordinary programs from squatting on them. Your own practice servers should pick a large number, like 12345, that no service has claimed."}
  ],
  activities:[
   {type:"match", tag:"Drag &amp; drop", title:"Match each number to its meaning",
    instr:"Drag each address or port onto the description it matches.",
    tokens:[
      {id:"a1", text:"127.0.0.1"},
      {id:"a2", text:"0.0.0.0"},
      {id:"a3", text:"443"},
      {id:"a4", text:"192.168.1.20"}
    ],
    targets:[
      {id:"at1", title:"The local computer itself", hint:"Loopback, used when testing both programs on one machine", accept:"a1"},
      {id:"at2", title:"Every interface on this device", hint:"A server willing to take requests arriving on any of its networks", accept:"a2"},
      {id:"at3", title:"Reserved for secure web servers", hint:"Sits inside the first 1,024, so ordinary programs must not claim it", accept:"a3"},
      {id:"at4", title:"One ordinary device on a network", hint:"Four denary values, each fitting in a single byte", accept:"a4"}
    ]}
  ],
  quiz:[
    {type:"mcq", q:"Which of the following uniquely identifies both a program and the machine it is running on?",
     opts:["An IPv4 address on its own, since it identifies the device","A port number on its own, since it identifies the program","An IPv4 or IPv6 address on its own, whichever the network uses","An IPv4 or IPv6 address combined with a port number"],
     ans:3, wrongWhy:{0:"An IPv4 address only narrows it down to the device. Many programs run on that device, so the specific program is still unknown.",1:"Port numbers repeat across devices: thousands of machines each have their own port 443. Without an address you do not know which machine.",2:"Either kind of address still only identifies the device. The program on that device remains unidentified without a port."}, why:"An address alone names only the device, and a port alone names only a program slot that exists on every device. Identifying one program on one machine takes the combination: an IP address (IPv4 or IPv6) together with a port number."},
    {type:"mcq", q:"Which of the following is a valid IPv4 address?",
     opts:["10.133.16.165","10.133.256.165","2001:db8::17","10.133.16.165.1"],
     ans:0, wrongWhy:{1:"Each denary number in an IPv4 address must fit in one byte, so the maximum is 255. The value 256 is out of range.",2:"Groups of hexadecimal digits separated by colons is the IPv6 presentation, not IPv4.",3:"IPv4 addresses have exactly 4 denary numbers for 4 bytes. This one has five."}, why:"An IPv4 address is 32 bits shown as exactly 4 denary numbers, each 0 to 255, separated by dots. 10.133.16.165 fits. The others fail on range (256), format (colons mean IPv6) or length (five numbers)."},
    {type:"short", q:"You want to test a server and a client on the same laptop. State the IPv4 address the client should connect to, and suggest a suitable port, justifying both choices.",
     model:"Connect to <b>127.0.0.1</b>, the special loopback address that refers to the local computer, so the connection stays inside the laptop. Choose a port above the reserved first 1,024, such as <b>12345</b>, since low ports are set aside for well-known services like web servers on 80 and 443."}
  ]
},
/* ---------- MODULE 3: CLIENTS, SERVERS AND THE CONNECTION ---------- */
{
  id:"connection", num:"3", title:"Clients, Servers &amp; the Connection",
  lo:"LO 4.1.5: Explain client-server architecture.",
  learn:`
    <p>Creating a socket connection is a multi-step process that requires one program to be the <strong>server</strong> and the other to be the <strong>client</strong>. The two roles differ: <b>servers listen</b> for incoming connections while <b>clients initiate</b> the connection. The server's IP address and port number must be known ahead of time by the client.</p>
    <ul>
      <li>First, the server creates a <strong>passive socket</strong>, binds it to the pre-chosen port number and listens. A passive socket is <em>not connected</em>: it merely waits for an incoming connection request.</li>
      <li>Next, the client initiates a connection request using the server's IP address and port number. If no server is listening on that port, the connection is <strong>refused</strong>.</li>
      <li>If a server is listening there, the server accepts and creates a <strong>new socket</strong> for the requesting client. The passive socket goes back to listening for further connections while the client and server exchange data using the newly created socket.</li>
    </ul>
    <div class="key"><b>Symmetry after setup:</b> the newly created socket is symmetrical. Once established, data sent on one end is received on the other, in both directions, client to server and server to client.</div>
    <p>The new socket may re-use the server's port number, because the combination with the far end's address and port is still unique. Internally the passive socket keeps a queue of connection requests; each call to accept removes one request from the queue, or waits if the queue is empty.</p>`,
  expanders:[
    {t:"What does 'blocking' mean?", b:"A blocked process is waiting for some event to occur. The accept call blocks the server until a connection request arrives, which is why a freshly started server appears stuck. Later you will see that recv also blocks until at least one byte is received."},
    {t:"Why create a new socket per client?", b:"The passive socket has one job: listening. If it were also used to talk to a client, the server could not hear anyone else. Handing each accepted client its own socket keeps the listening slot free, which is what lets one server deal with many clients."}
  ],
  activities:[
   {type:"steps", tag:"Interactive walkthrough", title:"Watch a connection come to life",
    instr:"Step through the lifecycle of a socket connection. Use Next and Back, and watch both programs and the pipe between them.",
    steps:[
      {t:"Server creates a passive socket", d:"The server program calls socket.socket() to create a socket object. Nothing is connected yet and no port has been claimed.", s:"Passive socket created", c:"Not started", pipe:""},
      {t:"Server binds to a port", d:"bind(('127.0.0.1', 1234)) attaches the passive socket to the pre-chosen port. The client must know this number ahead of time.", s:"Bound to port 1234", c:"Not started", pipe:""},
      {t:"Server listens and waits", d:"listen() turns the socket into a listening one, and accept() then blocks the server until a request arrives. The server now appears stuck: that is normal.", s:"Listening on 1234, accept() blocking", c:"Not started", pipe:"Listening..."},
      {t:"Client initiates a connection", d:"The client calls connect(('127.0.0.1', 1234)) using the server's known address and port. Had nothing been listening there, this request would be refused.", s:"Listening on 1234, accept() blocking", c:"connect() request sent", pipe:"Connection request &#8594;"},
      {t:"Server accepts, new socket born", d:"accept() returns a tuple: a brand new socket for this client, plus the client's address. The client's end gets a dynamically assigned port, here 4321.", s:"New socket created for client", c:"Connected from port 4321", pipe:"Accepted!"},
      {t:"Bytes flow both ways", d:"The connection is symmetrical: either end can sendall() bytes and the other end recv()s them. Server to client and client to server both work on this one socket.", s:"sendall() / recv() on new socket", c:"sendall() / recv()", pipe:"bytes &#8646; bytes"},
      {t:"Close, and listen again", d:"Both ends close the data socket when done. The passive socket was never part of the conversation, so it can keep listening and accept the next client.", s:"Data socket closed, still listening", c:"Socket closed", pipe:"Listening..."}
    ]},
   {type:"scenario", tag:"Scenario decision", title:"Debug the connection",
    cards:[
     {stem:"Your client program crashes immediately with ConnectionRefusedError on its connect() call. The address and port typed in match what the server code specifies.",
      role:"Role: Debugging your first client-server pair",
      choices:[
        {t:"Check that the server program was started first and is currently blocked on its accept() call.", correct:true},
        {t:"Increase the number passed to recv() so the client can receive larger replies from the server.", correct:false, whyNot:"The crash happens at connect(), before any data could ever be received. The size passed to a later recv() call cannot influence whether the connection is established."},
        {t:"Make the client call bind() on the server's port before connecting to it.", correct:false, whyNot:"Binding to a port is the server's step for claiming where it listens. A client claiming that same port on its own machine does nothing to create a listener at the server's address."}
      ],
      ok:"A connection is refused when no server is listening at that address and port, so the first check is whether the server is running and blocked on accept(). The recv() size only matters after connecting, and bind() is the server's step, not the client's.",
      no:"Work out what refuses a connection: it is the absence of a listening server at that address and port. Options about receive sizes or client-side binding touch code that only matters after, or never, in this failure."}
    ]}
  ],
  quiz:[
    {type:"mcq", q:"Which of the following statements about using sockets is FALSE?",
     opts:["Before connecting, the client must know the server's IP address and port number, but not vice versa","The server must already be running before the client can successfully connect","For each connection, the client's port number must match the server's port number","The server uses one socket solely to listen, and creates a completely new socket each time it accepts a connection"],
     ans:2, wrongWhy:{0:"This one is true: the client initiates, so it needs the server's details ahead of time, while the server just accepts whoever arrives.",1:"This one is true: if nothing is listening on the chosen port when the client connects, the request is refused.",3:"This one is true: the passive socket only listens, and each accepted client gets its own newly created socket."}, why:"The two port numbers are independent: the server end sits on its pre-chosen port while the client end gets a dynamically assigned port, like 1234 talking to 4321. The other three statements accurately describe how sockets behave."},
    {type:"mcq", q:"What does the server's accept() call return?",
     opts:["The number of connection requests still waiting in the queue","The passive socket, reset and ready for the next client to use","The first bytes of data that the connecting client has sent over","A new socket for the connection together with the client's address tuple"],
     ans:3, wrongWhy:{0:"The queue is managed internally. accept() removes one request from it, but never reports how many remain.",1:"The passive socket is never handed out for conversations: it stays behind, still listening for further requests.",2:"No data has flowed yet at the moment of acceptance. Receiving bytes is a separate, later step using recv()."}, why:"accept() waits for an incoming connection and returns a tuple: a newly created socket object for that client, plus an address tuple with the client's IP address and port. The new socket is the one actually used to send and receive."},
    {type:"short", q:"A client calls connect() to an address and port where no server is listening. State what happens, and explain why.",
     model:"The connection request is <b>refused</b> (the client raises an error such as ConnectionRefusedError). A connection can only be established if a server has bound a passive socket to that port and is listening for requests; with no listener at that address and port, the operating system rejects the request."}
  ]
},
/* ---------- MODULE 4: STR, BYTES AND UTF-8 ---------- */
{
  id:"encoding", num:"4", title:"str, bytes &amp; UTF-8",
  lo:"LO 3.2.1 link and groundwork for LO 4.1.6: sockets carry raw bytes, so text must be encoded.",
  learn:`
    <p>Sockets work at a very basic level: they can only send and receive <strong>raw bytes</strong>. Text must first be turned into a sequence of 8-bit values using Python's <code>bytes</code> type.</p>
    <p>Internally, a Python <code>str</code> is a sequence of numbers called Unicode <strong>code points</strong>. There are over a million possible code points, so it is not always possible to represent a code point in just 8 bits. The Unicode standard defines the <strong>UTF-8</strong> encoding so code points can be represented as bytes in a space-efficient, consistent manner.</p>
    <div class="key"><b>The two conversions:</b><br>&#8226; <code>'Unicode str'.encode()</code> converts <b>str &#8594; bytes</b> using UTF-8.<br>&#8226; <code>b'Raw bytes'.decode()</code> converts <b>bytes &#8594; str</b> using UTF-8.</div>
    <p>A <code>bytes</code> literal starts with the letter <code>b</code> followed by ASCII characters in quotes, such as <code>b'Hello from server\\n'</code>. Most escape codes that work for <code>str</code> literals also work for <code>bytes</code> literals.</p>
    <p>The character &#20013; can be written as the str literal <code>'\\u4e2d'</code>, an escape code giving its Unicode code point. Evaluating <code>len('\\u4e2d')</code> gives <b>1</b>: one code point. Evaluating <code>len('\\u4e2d'.encode())</code> gives <b>3</b>: UTF-8 represents this code point using three bytes.</p>`,
  expanders:[
    {t:"Why not one byte per character?", b:"With over a million possible code points and only 256 values in a byte, one byte per character cannot work for all of Unicode. UTF-8 spends one byte on common ASCII characters and up to four bytes on rarer code points, which keeps English text compact while still covering every language."},
    {t:"When do encode and decode happen in socket code?", b:"Right at the edges. Just before sendall: build your message as a str, then encode it to bytes. Just after receiving: collect the bytes, then decode back to str for display. In between, everything travelling through the socket is bytes."}
  ],
  activities:[
   {type:"bytes", tag:"Try it yourself", title:"Code points vs bytes: the encoding lab",
    instr:"Type any text, or tap a sample, and watch len(text) and len(text.encode()) diverge. Your mission: display a string where a single character needs three or more bytes.",
    samples:["A","Hi!","S$5","中","café","😀"]},
   {type:"code", tag:"Python exercise · runs in your browser", title:"Write the encoder helper",
    task:"Every message our later programs transmit must be <b>UTF-8 bytes ending with the <code>\\n</code> marker</b>. Complete <code>make_message(text)</code> so it returns exactly those bytes for any str <code>text</code>. Example: <code>make_message('hi')</code> returns <code>b'hi\\n'</code>. Then press Run: your code is executed and checked right here in the browser.",
    starter:`def make_message(text):
    # Return the bytes to transmit:
    # the UTF-8 encoding of text, ending with the newline marker
    return text
`,
    setup:"",
    check:String.raw`fn = __g.get("make_message")
if not callable(fn):
    __result["feedback"] = "Keep the function name make_message: the checker calls it."
else:
    probs = []
    r = fn("hi")
    if not isinstance(r, (bytes, bytearray)):
        probs.append("make_message('hi') returned a " + type(r).__name__ + ", but sockets need bytes. Use .encode().")
    elif bytes(r) != b"hi\n":
        probs.append("make_message('hi') returned " + repr(bytes(r)) + " but b'hi\\n' was expected. Encode first, then append the marker.")
    if not probs:
        r2 = fn("中")
        if not isinstance(r2, (bytes, bytearray)) or len(bytes(r2)) != 4:
            probs.append("make_message('中') should be 4 bytes: 3 for the character in UTF-8 plus 1 for the marker.")
    if not probs:
        r3 = fn("")
        if not isinstance(r3, (bytes, bytearray)) or bytes(r3) != b"\n":
            probs.append("An empty text should still end with the marker: expected b'\\n'.")
    if probs:
        __result["feedback"] = " ".join(probs)
    else:
        __result["passed"] = True
        __result["feedback"] = "make_message() encodes to UTF-8 and appends the marker: exactly what sendall() needs, and the receiver's loop can now find the end."`}
  ],
  quiz:[
    {type:"mcq", q:"The character 中 can be written as the str literal '\\u4e2d'. What is the result of evaluating len('\\u4e2d')?",
     opts:["An error","1","2","3"],
     ans:1, wrongWhy:{0:"The expression is valid Python: the escape code simply produces a one-character string, and len() happily measures it.",2:"len() on a str counts code points, not the characters typed in the escape code. The escape collapses into a single code point.",3:"Three is the byte count after encoding. Without encode(), len() counts code points, and there is only one here."}, why:"A str is a sequence of Unicode code points, and '\\u4e2d' is one code point, the character 中. So len() returns 1. The escape code notation is just a way of typing it."},
    {type:"mcq", q:"What is the result of evaluating len('\\u4e2d'.encode())?",
     opts:["An error","1","2","3"],
     ans:3, wrongWhy:{0:"encode() is exactly the method designed for this conversion, so no error occurs: it returns the UTF-8 bytes of the string.",1:"One is the number of code points. After encoding, len() counts bytes, and UTF-8 needs more than one byte for this character.",2:"Close, but UTF-8 assigns this particular code point a three-byte representation, not two."}, why:"encode() converts the str to its UTF-8 bytes, and UTF-8 represents the code point for 中 using three bytes, so len() returns 3. One code point, three bytes: the two lengths measure different things."},
    {type:"mcq", q:"A program has received data = b'OK'. Which expression converts it into a str?",
     opts:["data.decode()","data.encode()","str.encode(data)","bytes(data)"],
     ans:0, wrongWhy:{1:"encode() runs in the opposite direction, from str to bytes, and bytes objects do not have an encode method.",2:"str.encode expects a str to work on, and even then it would produce bytes, the wrong direction entirely.",3:"bytes(data) just gives another bytes object. Nothing is interpreted as text."}, why:"decode() is the bytes-to-str direction, interpreting the raw bytes as UTF-8 text, so data.decode() gives the str 'OK'. encode() goes the other way, from str to bytes, ready for sending."},
    {type:"short", q:"A program builds the message reply = 'Ready' and calls my_socket.sendall(reply). Explain why this fails and write the corrected call.",
     model:"Sockets can only send and receive <b>bytes</b>, but reply is a <b>str</b>, a sequence of Unicode code points, so sendall raises a TypeError. Convert it first with UTF-8 encoding: <code>my_socket.sendall(reply.encode())</code>."}
  ]
},
/* ---------- MODULE 5: FIRST SOCKET PROGRAMS ---------- */
{
  id:"firstprograms", num:"5", title:"Your First Socket Programs",
  lo:"LO 4.1.6: Implement a server and client with socket programming.",
  learn:`
    <p>Python's <code>socket</code> module creates and manages sockets. Here is a basic server that listens on port 12345, accepts one connection, sends a greeting through the socket, then closes:</p>
    <pre class="codebox"><span class="cb-t">Program 1: basic_server.py</span>
import socket

my_socket = socket.socket()
my_socket.bind(('127.0.0.1', 12345))
my_socket.listen()

new_socket, addr = my_socket.accept()
print('Connected to: ' + str(addr))
new_socket.sendall(b'Hello from server\\n')
new_socket.close()
my_socket.close()</pre>
    <p>Any large port number works, but it must be decided ahead of time so the client knows where to connect. Note that <code>accept()</code> returns a tuple of the newly created socket and a nested address tuple; <code>new_socket</code> is the one actually used to send and receive. When run, the server appears stuck shortly after starting: <code>accept()</code> is <strong>blocking</strong> until a connection request arrives.</p>
    <p>The client below runs in a <em>second</em> copy of Python. It asks for the server's address and port, connects, receives at most 1024 bytes, and closes:</p>
    <pre class="codebox"><span class="cb-t">Program 2: basic_client.py</span>
import socket

my_socket = socket.socket()

address = input('Enter IPv4 address of server: ')
port = int(input('Enter port number of server: '))

my_socket.connect((address, port))
print(my_socket.recv(1024))
my_socket.close()</pre>
    <p>The argument to <code>recv()</code> is required and should be a relatively small power of 2, such as 2<sup>10</sup> = 1024. With the server still running, enter <code>127.0.0.1</code> and <code>12345</code>: the client prints <code>b'Hello from server\\n'</code> and the server becomes unstuck and ends normally.</p>
    <div class="key"><b>Method summary:</b> <code>bind((host, port))</code> attaches a socket to an address; <code>listen()</code> enables listening; <code>accept()</code> waits and returns (new socket, address); <code>connect((host, port))</code> initiates a connection; <code>recv(max_bytes)</code> receives up to the given number of bytes; <code>sendall(bytes)</code> sends the given bytes.</div>`,
  expanders:[
    {t:"Running both programs on one machine", b:"Start two separate copies of Python (in IDLE, run it twice and keep the windows apart). Run the server in copy 1; it blocks on accept. Run the client in copy 2 and connect to 127.0.0.1. If you accidentally run both in one shell, the first program gets stopped, so keep the two shells clearly separated."},
    {t:"The firewall dialog", b:"The first time a server binds and listens, a firewall may ask whether Python is allowed network access. Allowing it matters only if you want connection requests from other computers; for loopback practice on 127.0.0.1 you can cancel safely."}
  ],
  activities:[
   {type:"order", tag:"Build the program", title:"Assemble basic_server.py",
    instr:"Tap the line that comes next, from the first line to the last, to rebuild the server. Wrong taps are counted, so think before you tap.",
    lines:[
      "import socket",
      "my_socket = socket.socket()",
      "my_socket.bind(('127.0.0.1', 12345))",
      "my_socket.listen()",
      "new_socket, addr = my_socket.accept()",
      "new_socket.sendall(b'Hello from server\\n')",
      "new_socket.close()"
    ]},
   {type:"match", tag:"Drag &amp; drop", title:"Match each method to its job",
    instr:"Drag each socket method onto the job it performs.",
    tokens:[
      {id:"m1", text:"bind()"},
      {id:"m2", text:"listen()"},
      {id:"m3", text:"accept()"},
      {id:"m4", text:"connect()"},
      {id:"m5", text:"recv(1024)"},
      {id:"m6", text:"sendall()"}
    ],
    targets:[
      {id:"mt1", title:"Claim a port number", hint:"The server step that attaches the program to its pre-chosen channel", accept:"m1"},
      {id:"mt2", title:"Start waiting for callers", hint:"Turns the passive end on so requests can begin arriving", accept:"m2"},
      {id:"mt3", title:"Take the next request", hint:"Blocks until a caller arrives, then hands back a fresh two-way channel", accept:"m3"},
      {id:"mt4", title:"Reach out to the far end", hint:"The client step, needing the other side's details known ahead of time", accept:"m4"},
      {id:"mt5", title:"Read what has arrived", hint:"Blocks until at least one byte is available, up to a stated ceiling", accept:"m5"},
      {id:"mt6", title:"Push data out", hint:"Transmits an entire sequence through the established channel", accept:"m6"}
    ]},
   {type:"code", tag:"Python exercise · runs in your browser", title:"Write the whole client",
    task:"A (simulated) server is listening at <code>127.0.0.1</code> port <code>12345</code>. The moment a client connects, it sends <code>b'Hello from server\\n'</code>. Write the <b>complete client</b>: import the module, create a socket, connect, print what <code>recv(1024)</code> returns, and close the socket. <code>input()</code> is disabled here, so write the address and port directly. Connect to the wrong port and you will meet a genuine ConnectionRefusedError.",
    starter:`import socket

# 1. create the socket
# 2. connect to the server at 127.0.0.1, port 12345
# 3. print what recv(1024) returns
# 4. close the socket
`,
    setup:String.raw`PEER = {"addr": ("127.0.0.1", 12345), "chunks": [b"Hello from server\n"]}
_install_socket(PEER)`,
    check:String.raw`if not _SOCKETS:
    __result["feedback"] = "No socket was created. Start with socket.socket()."
else:
    s = _SOCKETS[0]
    ops = [e[0] for e in s.log]
    got = _received_all(s)
    if "connect" not in ops:
        __result["feedback"] = "The socket never connected. Call connect() with the address tuple ('127.0.0.1', 12345): note the double brackets."
    elif "recv" not in ops:
        __result["feedback"] = "Connected, but nothing was received. Call recv(1024) and print the result."
    elif got != b"Hello from server\n":
        __result["feedback"] = "recv() has returned " + repr(got) + " so far, not the full greeting. Receive up to 1024 bytes."
    elif not s.closed:
        __result["feedback"] = "Everything arrived. Last step: close() the socket."
    else:
        __result["passed"] = True
        __result["feedback"] = "A complete client: create, connect, receive, print, close. This is basic_client.py with the address and port written in directly."`}
  ],
  quiz:[
    {type:"mcq", q:"Shortly after basic_server.py is started, the program appears stuck. Which line is responsible, and why?",
     opts:["my_socket.listen(), because listening consumes the program until a client arrives","my_socket.bind(('127.0.0.1', 12345)), because binding waits for the port to become free","new_socket, addr = my_socket.accept(), because accept blocks until a connection request is received","print('Connected to: ' + str(addr)), because printing waits for the console"],
     ans:2, wrongWhy:{0:"listen() merely switches the socket into listening mode and returns immediately. The waiting happens elsewhere.",1:"bind() claims the port and returns straight away, or raises an error if the port is taken. It does not wait around.",3:"print() writes to the console and moves on. By the time it runs, the connection already exists."}, why:"accept() is a blocking call: it prevents the program from continuing until a connection request is received. bind() and listen() both complete immediately, which is why the server reaches accept() and then appears stuck, entirely by design."},
    {type:"mcq", q:"What does my_socket.recv(1024) do?",
     opts:["Receives and returns up to 1024 bytes from the socket","Receives exactly 1024 bytes, waiting until all of them have arrived","Reserves 1024 bytes of memory for this connection to use","Splits any outgoing data into separate 1024-byte packets"],
     ans:0, wrongWhy:{1:"recv treats the number as a ceiling, not a target. It happily returns fewer bytes, whatever has arrived so far.",2:"No memory reservation is involved. The argument limits how much one call may return, nothing more.",3:"recv is about receiving. Outgoing data is the job of sendall, which needs no size argument at all."}, why:"The argument is a maximum: recv blocks until at least one byte is available, then returns up to 1024 bytes, possibly fewer. That 'possibly fewer' is the hidden flaw explored in the next topic."},
    {type:"short", q:"Once a socket is established it is symmetrical, yet basic_server.py and basic_client.py only send data one way. Describe the changes needed so the client sends b'Hello from client\\n' and the server prints whatever it receives.",
     model:"Client: after connecting, replace the print/recv line with <code>my_socket.sendall(b'Hello from client\\n')</code>, then close. Server: after accepting, replace the sendall line with <code>print(new_socket.recv(1024))</code>, then close both sockets. The server should bind to <b>0.0.0.0</b> or 127.0.0.1 and, as before, recv blocks until at least 1 byte arrives."}
  ]
},
/* ---------- MODULE 6: DESIGNING A PROTOCOL ---------- */
{
  id:"protocol", num:"6", title:"Designing a Protocol",
  lo:"LO 4.1.3 and 4.1.6: Explain the need for communication protocols; implement an iterative server.",
  learn:`
    <p>The basic programs have a hidden flaw: with longer data, only part may arrive in one go. If the bytes are sent as multiple packets over a busy network, a single <code>recv()</code> may return just the first piece. We can simulate this by splitting the send and delaying the second half:</p>
    <pre class="codebox"><span class="cb-t">Program 3: basic_server_split.py (extract)</span>
new_socket.sendall(b'Hello fr')
time.sleep(0.1)
new_socket.sendall(b'om server\\n')</pre>
    <p>The client from before prints only <code>b'Hello fr'</code>. In general, <strong>never assume that recv() returns all the bytes that were sent</strong>. The only way to be certain a message is complete is to agree beforehand on a <strong>protocol</strong>: a set of rules for how communication takes place.</p>
    <p>A simple protocol: every transmission ends with the newline character <code>\\n</code>, and the data itself never contains <code>\\n</code>. The receiver then loops, appending whatever arrives, until the end marker appears:</p>
    <pre class="codebox"><span class="cb-t">Program 4: basic_client_protocol.py (extract)</span>
data = b''
while b'\\n' not in data:
    data += my_socket.recv(1024)
print(data)</pre>
    <p><strong>Iterative servers:</strong> a real server should keep running so it is always available. Wrapping the accept-and-serve code in an infinite loop makes an <strong>iterative server</strong>: it processes clients one at a time, each accept() serving the next request in the queue. A <strong>concurrent server</strong> would instead start a thread per client to serve many at once; iterative servers are simpler, and are the kind required here.</p>
    <p>With these tools, a chat program is possible: each side takes turns to send one line, terminated by <code>\\n</code>, and loops receiving until that marker arrives. Since each message is a single line, <code>\\n</code> can never appear inside a message, so the protocol holds.</p>`,
  expanders:[
    {t:"Why does the loop use data += recv(1024)?", b:"Each recv call returns whatever fragment has arrived, possibly tiny. Appending accumulates the fragments in order until the end marker shows up, at which point the message is guaranteed complete. Overwriting instead of appending would throw earlier fragments away."},
    {t:"Ending a chat cleanly: the quit rule", b:"An infinite chat loop can only be escaped with Ctrl-C unless the protocol includes an exit rule. One approach: when either side sends the message 'quit', both programs break out of their loops after the message is delivered, then close every socket, including the server's listening socket."}
  ],
  activities:[
   {type:"scenario", tag:"Scenario decision", title:"The half-message mystery",
    cards:[
     {stem:"Your client prints b'Hello fr' instead of the full greeting. The server definitely called sendall() with the complete message.",
      role:"Role: Fixing a real transmission bug",
      choices:[
        {t:"Raise the recv() argument from 1024 to 65536 so that one call can hold the whole greeting.", correct:false, whyNot:"The 1024 ceiling was never the problem: the greeting is far smaller than that. recv() returned early because the remaining bytes had not arrived yet, and a bigger ceiling cannot conjure them up."},
        {t:"Loop on recv(), appending to the data, until the agreed end-of-message marker appears in it.", correct:true},
        {t:"Insert time.sleep(1) before the recv() call so the network has time to deliver everything.", correct:false, whyNot:"A fixed pause is a guess about network timing. On a congested network one second may still be too short, and when things are fast it wastes time; nothing guarantees completeness."}
      ],
      ok:"recv() returned the bytes that had arrived so far, and neither a bigger ceiling nor a timed pause guarantees the rest have landed. Only a protocol works: loop and append until the agreed marker, like \\n, is seen, then the message is provably complete.",
      no:"The missing bytes simply had not arrived when recv() returned. Ask which option gives certainty rather than hope: only one of them can prove the message is complete."}
    ]},
   {type:"code", tag:"Python exercise · runs in your browser", title:"Receive the whole message",
    task:"<code>chat_socket</code> is already connected for you, and the far end has sent a greeting. But this simulated network is congested: <b>the bytes arrive in several separate fragments</b>, so one <code>recv()</code> is not enough. Using a loop, keep receiving until the <code>b'\\n'</code> marker has arrived, collect everything into the variable <code>message</code>, then close the socket. Careful: a loop with the wrong condition will run forever (it gets stopped after 15 seconds).",
    starter:`# chat_socket is already connected for you
message = b''

# loop here: keep calling chat_socket.recv(1024)
# until the b'\\n' marker is inside message

chat_socket.close()
`,
    setup:String.raw`PEER = {"addr": ("127.0.0.1", 6789), "chunks": [b"Hel", b"lo fr", b"om server\n"]}
_install_socket(PEER)
import socket as __sockmod
chat_socket = __sockmod.socket()
chat_socket.connect(("127.0.0.1", 6789))
chat_socket.log.clear()`,
    check:String.raw`msg = __g.get("message")
s = chat_socket
n = len(_recv_calls(s))
if not isinstance(msg, (bytes, bytearray)):
    __result["feedback"] = "Keep message as bytes: start from b'' and append what recv() returns."
elif bytes(msg) == b"Hel":
    __result["feedback"] = "message holds only the first fragment. One recv() call is never guaranteed to return everything that was sent: loop until the marker arrives."
elif b"\n" not in bytes(msg):
    __result["feedback"] = "message is " + repr(bytes(msg)) + ": the end marker has not arrived yet, so the loop stopped too early. Keep receiving and appending."
elif bytes(msg) != b"Hello from server\n":
    __result["feedback"] = "message is " + repr(bytes(msg)) + " but the full greeting is b'Hello from server\\n'. Append every fragment in order, without losing any."
elif not s.closed:
    __result["feedback"] = "The loop is right. Last step: close() the socket."
else:
    __result["passed"] = True
    __result["feedback"] = "It took " + str(n) + " recv() calls to gather the whole greeting. This append-until-marker loop is the protocol pattern every later program relies on."`}
  ],
  quiz:[
    {type:"mcq", q:"A remote control sends a robot only these instructions, in any order and any number of times: b'FORWARD\\n', b'LEFT\\n', b'RIGHT\\n', with b'END\\n' always sent last, after which both sides close the socket. Which bytes may be returned by a single socket.recv() call on the robot?",
     opts:["b'ND\\nLEFT\\nLEFT\\nFORWARD\\nRIGHT\\nRIGHT'","b'RWARD\\nFORWARD\\nFORWARD\\nRIGHT\\nEND\\n'","b'RIGHT\\nBACK\\nFORWARD\\nRIGHT\\nRIGHT\\nE'","b'\\nLEFT\\nLEFT\\nFORWARD\\nRIGHT\\nLEFTFOR'"],
     ans:1, wrongWhy:{0:"The fragment 'ND\\n' can only be the tail of END, and END must be the final instruction: no LEFT or FORWARD may follow it in the stream.",2:"BACK is not one of the four valid instructions, so this sequence of bytes can never have been sent under the protocol.",3:"Near the end, LEFTFOR shows LEFT running into FOR with no newline between them, which the protocol never produces: every instruction ends with its own marker."}, why:"recv() may start mid-instruction, so a fragment like 'RWARD\\n' (the tail of FORWARD) is legitimate, and everything after it here parses as complete valid instructions with END last. The others break the rules: bytes after END, an invalid BACK instruction, or two instructions fused without a newline."},
    {type:"mcq", q:"What is the key limitation of an iterative server?",
     opts:["It must be restarted manually after every client disconnects","It cannot use the newline protocol to delimit messages","It only accepts clients that connect from the same machine","It serves one client at a time, so the others must wait"],
     ans:3, wrongWhy:{0:"The infinite loop around accept() exists precisely so the server keeps going, client after client, with no restarts.",1:"Message protocols sit on top of the socket and work identically whether the server is iterative or concurrent.",2:"Where clients connect from depends on the address bound, such as 0.0.0.0 for all interfaces. Iteration has nothing to do with it."}, why:"An iterative server loops accept, serve, close: easy to write, but each client is served in turn, so a slow client keeps everyone else queued. Serving many clients at the same time takes a concurrent server with a thread per client."},
    {type:"short", q:"Both chat programs loop forever and can only be stopped with Ctrl-C. State the changes needed so that both programs exit cleanly once either user sends the message 'quit'.",
     model:"After <b>sending</b>: if the text just sent was <code>b'quit'</code>, break out of the loop. After <b>receiving</b>: if the accumulated message equals <code>b'quit\\n'</code>, break out of the loop. Then, outside the loops, <b>close all sockets properly</b>: the chat socket on both sides, and the server's listening socket too."}
  ]
},
/* ---------- MODULE 7: TURN-BASED GAMES ---------- */
{
  id:"games", num:"7", title:"Case Study: Turn-Based Games",
  lo:"LO 4.1.6: Given the server code, implement the client code for a given scenario, and vice-versa.",
  learn:`
    <p>So far we wrote both ends ourselves. Sometimes the other side is developed by someone else, based on an existing standard or protocol. To write a client that talks to an existing server (or vice versa), <strong>start by studying the code and understanding the protocol being used</strong>.</p>
    <p>The Tic-Tac-Toe server uses a tiny protocol with two message types, each ending in <code>\\n</code>:</p>
    <ul>
      <li><code>b'MOVE'</code> + cell number + <code>b'\\n'</code>: the sender has marked that cell, for example <code>b'MOVE7\\n'</code>.</li>
      <li><code>b'END\\n'</code>: the sender quits; the receiver wins and both sides close.</li>
    </ul>
    <p>Reading game_server.py reveals a repeating loop: display the board, check opponent won, check board full, prompt for the server player's move and send it as <code>MOVE</code>, display again, check server player won, check board full, then <em>receive</em> the opponent's action and apply it. As written, <strong>the server player always starts first</strong>.</p>
    <div class="key"><b>Deriving the client:</b> Tic-Tac-Toe is symmetrical apart from who starts, so the client's loop is the same with sending and receiving swapped, and the receive step moved to the front: the client must begin by receiving the server's first move.</div>
    <p>Games need not be symmetrical. In the guess-the-number game the server picks a random number from 1 to 100 and the client gets 5 tries. The server drives everything with one-word messages: <code>b'GUESS\\n'</code> invites the client to send a number (digits then <code>\\n</code>); the server replies <code>b'LOW\\n'</code> or <code>b'HIGH\\n'</code> after a wrong guess; <code>b'WIN\\n'</code> or <code>b'GAMEOVER\\n'</code> ends the game. Writing the missing side means obeying this protocol exactly, message for message.</p>`,
  expanders:[
    {t:"Reading a protocol out of code", b:"Hunt for every sendall and every recv loop, and list what bytes each can carry. That list IS the protocol: message formats, who sends first, what ends the session. Once you have it, the other program almost writes itself: mirror each send with a receive and vice versa."},
    {t:"Why the client receives first", b:"The server prompts its own player before it ever listens for the opponent, so the first MOVE always travels server to client. A client that also tried to send first would deadlock: both sides waiting to be heard, nobody listening. Turn order is part of the protocol."}
  ],
  activities:[
   {type:"match", tag:"Drag &amp; drop", title:"Decode the game protocols",
    instr:"Drag each protocol message onto its meaning.",
    tokens:[
      {id:"g1", text:"b'MOVE7\\n'"},
      {id:"g2", text:"b'END\\n'"},
      {id:"g3", text:"b'GUESS\\n'"},
      {id:"g4", text:"b'GAMEOVER\\n'"}
    ],
    targets:[
      {id:"gt1", title:"A player marked cell seven", hint:"Sent after a valid turn in the grid game", accept:"g1"},
      {id:"gt2", title:"The sender is quitting", hint:"Always the last thing sent in the grid game, opponent wins", accept:"g2"},
      {id:"gt3", title:"Send me a number now", hint:"The asymmetric game inviting the next attempt", accept:"g3"},
      {id:"gt4", title:"All five attempts used up", hint:"Closes the asymmetric game without success", accept:"g4"}
    ]},
   {type:"order", tag:"Build the loop", title:"Reconstruct the client's game loop",
    instr:"game_server.py sends the first move. Tap the client's loop steps in the correct order, remembering which step moves to the front.",
    lines:[
      "Receive the server's action; apply its MOVE, or end the game if END arrives",
      "Display the board showing the server's move",
      "Check whether the server has won",
      "Check whether the board is full (stalemate)",
      "Prompt for your move, update the board, and send it as MOVE with the cell number",
      "Display the board again showing your move",
      "Check whether you have won",
      "Check whether the board is now full (stalemate)"
    ]},
   {type:"code", tag:"Python exercise · runs in your browser", title:"Judge the guess",
    task:"The guessing-game server needs its judging logic. Complete <code>judge(guess, answer)</code> so it returns the <b>exact protocol bytes</b> the client understands: <code>b'LOW\\n'</code> if the guess is below the answer, <code>b'HIGH\\n'</code> if it is above, and <code>b'WIN\\n'</code> if they match. The client's recv loop depends on every reply ending with the marker.",
    starter:`def judge(guess, answer):
    # return b'LOW\\n', b'HIGH\\n' or b'WIN\\n'
    return b''
`,
    setup:"",
    check:String.raw`fn = __g.get("judge")
if not callable(fn):
    __result["feedback"] = "Keep the function name judge: the checker calls it."
else:
    cases = [(30, 50, b"LOW\n"), (80, 50, b"HIGH\n"), (50, 50, b"WIN\n"), (1, 100, b"LOW\n"), (100, 1, b"HIGH\n")]
    prob = ""
    for g, a, want in cases:
        r = fn(g, a)
        if not isinstance(r, (bytes, bytearray)):
            prob = "judge(" + str(g) + ", " + str(a) + ") returned a " + type(r).__name__ + ", but the protocol needs bytes literals like b'LOW\\n'."
            break
        if bytes(r) != want:
            prob = "judge(" + str(g) + ", " + str(a) + ") returned " + repr(bytes(r)) + " but the protocol requires " + repr(want) + ". Check the comparison, and remember the \\n marker."
            break
    if prob:
        __result["feedback"] = prob
    else:
        __result["passed"] = True
        __result["feedback"] = "Exactly the server's reply logic: LOW, HIGH or WIN, each ending with the marker so the client's recv loop can find the end of every reply."`}
  ],
  quiz:[
    {type:"mcq", q:"Why must game_client.py begin its loop by receiving, rather than sending?",
     opts:["The server player moves first, so the first message travels from server to client","Clients are never permitted to send until the server has closed its passive socket","recv() must always be called before sendall() on any newly created socket","The client cannot display its board until at least one message has been received"],
     ans:0, wrongWhy:{1:"The passive socket stays open throughout: it just listens. It places no restrictions on who sends data first.",2:"Sockets impose no such rule: either end may send first. The ordering comes from the game's protocol, not the socket.",3:"The client could display its empty board immediately. What it must not do is send before its turn."}, why:"Turn order is part of the protocol: the server prompts its own player first, so the opening MOVE flows server to client. The client mirrors the server's loop with the receive step moved to the front; sockets themselves allow either end to send first."},
    {type:"mcq", q:"In the guessing game, the server has just sent b'WIN\\n'. According to the protocol, what happens next?",
     opts:["The server sends b'GAMEOVER\\n' to confirm the result","The server picks a new random number and play continues","Both programs leave their loops and close their sockets","The client sends one final guess to acknowledge the win"],
     ans:2, wrongWhy:{0:"GAMEOVER is the failure ending, sent only when five tries are used up without success. It never follows WIN.",1:"Nothing in the protocol restarts play: WIN is a terminal message, ending the session for both sides.",3:"After WIN there is nothing left to guess, and the server is no longer listening for one. The client's job is to finish."}, why:"WIN and GAMEOVER are the two terminal messages: after either one, both programs break out of their loops and close their sockets, the server closing its listening socket too. Nothing further is sent in either direction."},
    {type:"short", q:"Outline the logic of guess_server.py, which plays the guessing game against the given client. Mention the setup, the loop, and the two possible endings.",
     model:"<b>Setup:</b> bind and listen on the agreed port, accept one client, pick <code>answer = random.randint(1, 100)</code>. <b>Loop (at most 5 times):</b> send <code>b'GUESS\\n'</code>, recv in a loop until <code>\\n</code> arrives, convert the digits to int; reply <code>b'LOW\\n'</code> if the guess is below the answer, <code>b'HIGH\\n'</code> if above, otherwise record success and break. <b>Endings:</b> send <code>b'WIN\\n'</code> if guessed, else <code>b'GAMEOVER\\n'</code> after 5 failures, then close both the game socket and the listening socket."}
  ]
}
];

/* ============ FINAL CHALLENGE ============ */
const CHALLENGE = {
  timerMins: 30,
  sectionA: [
    {topic:"Topic 4 · str, bytes and UTF-8",
     q:"A program holds message = 'quit'. Which expression produces a value that sendall() will accept?",
     opts:["message.encode()","message.decode()","str(message)","bytes(message)"],
     ans:0,
     why:"sendall() needs bytes, and encode() converts the str to its UTF-8 bytes. decode() runs the other way (and str has no decode method), str(message) is still a str, and bytes(message) raises a TypeError because no encoding is given."},
    {topic:"Topic 2 · IP addresses and ports",
     q:"A practice server needs a port number for general use. Which is a suitable choice?",
     opts:["80","443","21","12345"],
     ans:3,
     why:"The first 1,024 ports are reserved for specific kinds of programs: 80 and 443 belong to web servers, and 21 also sits inside the reserved range. A large number like 12345 is outside the reserved range and free for practice servers."},
    {topic:"Topic 6 · Protocols",
     q:"Why do the chat programs append b'\\n' to every message they send?",
     opts:["It makes the message display neatly on the receiving screen","It lets the receiver detect the end of a message, since recv() may return only part of it","It forces the socket to transmit the bytes immediately instead of buffering them","It converts the bytes back into a str automatically on arrival"],
     ans:1,
     why:"recv() may return a fragment, so the receiver loops until the agreed end marker \\n appears: only then is the message provably complete. That is a protocol at work. Display formatting, transmission timing and decoding are all separate concerns."},
    {topic:"Topic 3 · The connection",
     q:"Which statement describes the passive socket created by a server?",
     opts:["It is connected to the first client and used to transfer that client's data","It is created afresh for each client that successfully connects","It is not connected; it waits and listens for incoming connection requests","It initiates the connection by reaching out to each client's address"],
     ans:2,
     why:"A passive socket is not connected: it binds to the pre-chosen port and merely waits for requests. Data transfer happens on the new socket that accept() creates per client, and initiating connections is the client's role, never the passive socket's."},
    {topic:"Topic 1 and 3 · Client-server roles",
     q:"Which pairing of roles is correct?",
     opts:["Server: initiates the connection. Client: listens for incoming connections","Server: listens for incoming connections. Client: initiates the connection","Server and client both listen until either chooses to initiate","Server: connects to each client in turn. Client: accepts the connection"],
     ans:1,
     why:"The defining difference is exactly this: servers listen for incoming connections while clients initiate them. That is why the client must know the server's address and port ahead of time, and not vice versa."}
  ],
  sectionB: [
    {topic:"Topic 4 · str, bytes and UTF-8",
     q:"The variable word = '\\u4e2d' holds one Chinese character. State the values of len(word) and len(word.encode()), and explain why the two values differ.",
     scheme:[
       {pt:"len(word) is 1, because a str is a sequence of Unicode code points and this string contains one code point", m:1},
       {pt:"len(word.encode()) is 3, the number of bytes in the UTF-8 encoding of this character", m:1},
       {pt:"The values differ because UTF-8 may represent a single code point using more than one byte (up to four)", m:1}
     ]},
    {topic:"Topic 3 and 5 · Server setup",
     q:"Describe the steps a server program takes, from creating a socket to exchanging data with one client. Name the socket methods used at each step and state which call blocks.",
     scheme:[
       {pt:"Create a socket object with socket.socket()", m:1},
       {pt:"bind() the socket to an address and pre-chosen port, then enable listening with listen()", m:1},
       {pt:"accept() blocks until a connection request arrives", m:1},
       {pt:"accept() returns a new socket (plus the client's address); data is exchanged on the new socket using sendall() and recv()", m:1}
     ]},
    {topic:"Topic 6 · Protocols",
     q:"A client calls data = my_socket.recv(1024) once and assumes the whole message has arrived. Explain why this can fail, and describe a protocol together with the receiving code that fixes it.",
     scheme:[
       {pt:"recv() may return only part of the bytes sent, e.g. when data is split into packets on a congested network", m:1},
       {pt:"Agree a protocol: every message ends with an agreed marker such as \\n, which never occurs inside a message", m:1},
       {pt:"Receive in a loop, appending each recv() result to an accumulating bytes variable", m:1},
       {pt:"Stop looping once the marker is found in the accumulated bytes: the message is then complete", m:1}
     ]},
    {topic:"Topic 5 · Writing the other side",
     q:"A server binds to ('127.0.0.1', 12345), listens, accepts, then prints new_socket.recv(1024). Write a complete client program that connects to this server and sends b'Hello from client\\n'.",
     scheme:[
       {pt:"import socket and create the socket object with socket.socket()", m:1},
       {pt:"connect() using the address tuple ('127.0.0.1', 12345)", m:1},
       {pt:"Send using sendall()", m:1},
       {pt:"The data sent is a bytes literal (b'...') ending with \\n", m:1},
       {pt:"close() the socket at the end", m:1}
     ]},
    {topic:"Topic 7 · Asymmetric game server",
     q:"The guessing-game client understands b'GUESS\\n', b'LOW\\n', b'HIGH\\n', b'WIN\\n' and b'GAMEOVER\\n'. Outline the logic of the matching server, from setup to closing, including how each guess is received and judged.",
     scheme:[
       {pt:"Setup: bind() and listen() on the agreed port, accept() the client, choose answer = random.randint(1, 100)", m:1},
       {pt:"Loop at most 5 times, sending b'GUESS\\n' first each round", m:1},
       {pt:"Receive the guess with a recv() loop until \\n arrives, then convert the digits to an int", m:1},
       {pt:"Compare and reply: b'LOW\\n' if the guess is below the answer, b'HIGH\\n' if above", m:1},
       {pt:"If the guess matches, send b'WIN\\n' and stop; after 5 wrong tries send b'GAMEOVER\\n'; close the game socket and the listening socket", m:1}
     ]}
  ]
};
