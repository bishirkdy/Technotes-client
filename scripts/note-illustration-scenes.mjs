const box = (id, x, y, w, h, label, sub = null, kind = 'box', tone = 'plain') => ({
  id,
  x,
  y,
  w,
  h,
  label,
  sub,
  kind,
  tone
});

const arrow = (from, to, label = null, extra = {}) => ({
  from,
  to,
  label,
  ...extra
});

export const scenes = [
  {
    file: 'adonet-transactions',
    title: 'ADO.NET transactions',
    subtitle: 'commit, rollback, isolation, savepoints, and locks',
    alt: 'Hand-drawn ADO.NET transaction lifecycle with commit and rollback branches',
    nodes: [
      box('connection', 100, 300, 250, 110, 'SqlConnection', 'open connection'),
      box('transaction', 420, 300, 250, 110, 'DbTransaction', 'BeginTransaction()'),
      box('work', 740, 290, 200, 140, 'Try work', 'success?', 'diamond', 'amber'),
      box('commit', 1030, 190, 240, 100, 'Commit', 'persist changes', 'note', 'green'),
      box('rollback', 1030, 420, 240, 100, 'Rollback', 'undo changes', 'note', 'red'),
      box('database', 1360, 285, 180, 150, 'Database', null, 'cylinder', 'blue'),
      box('isolation', 340, 620, 310, 100, 'Isolation level', 'read committed / repeatable read / serializable', 'note', 'amber'),
      box('savepoint', 720, 620, 280, 100, 'Savepoint', 'partial rollback point', 'note', 'amber'),
      box('locks', 1090, 620, 300, 100, 'Locks', 'row / table / deadlock', 'note', 'amber')
    ],
    arrows: [
      arrow('connection', 'transaction', 'Begin'),
      arrow('transaction', 'work', 'run'),
      arrow('work', 'commit', 'success'),
      arrow('work', 'rollback', 'error'),
      arrow('commit', 'database', 'write'),
      arrow('rollback', 'database', 'revert', { dashed: true }),
      arrow('isolation', 'transaction', 'SET', { dashed: true }),
      arrow('savepoint', 'transaction', 'ROLLBACK TO', { dashed: true })
    ],
    notes: [
      { x: 1360, y: 490, text: 'ACID boundary', size: 18, color: '#537255' },
      { x: 255, y: 235, text: 'one unit of work', size: 18 }
    ]
  },
  {
    file: 'adonet-architecture',
    title: 'ADO.NET architecture',
    subtitle: 'connected streaming versus disconnected data access',
    alt: 'Hand-drawn ADO.NET connected and disconnected architecture',
    nodes: [
      box('connection', 100, 270, 230, 100, 'SqlConnection', 'open'),
      box('command', 390, 270, 230, 100, 'SqlCommand', 'execute'),
      box('reader', 680, 270, 230, 100, 'DataReader', 'stream rows'),
      box('loop', 970, 270, 230, 100, 'Read loop', 'fast, forward-only', 'box', 'green'),
      box('adapter', 390, 510, 230, 100, 'DataAdapter', 'fill / update'),
      box('table', 680, 510, 230, 100, 'DataTable', 'in-memory table'),
      box('dataset', 970, 510, 230, 100, 'DataSet', 'tables + relations'),
      box('provider', 1270, 340, 230, 160, 'Provider', 'connection, command, adapter, reader', 'note', 'amber')
    ],
    arrows: [
      arrow('connection', 'command'),
      arrow('command', 'reader'),
      arrow('reader', 'loop'),
      arrow('adapter', 'table', 'fill'),
      arrow('table', 'dataset', 'merge'),
      arrow('command', 'adapter', 'disconnected', { dashed: true }),
      arrow('dataset', 'provider', 'uses', { dashed: true })
    ],
    notes: [
      { x: 225, y: 230, text: 'Connected path', size: 20, color: '#3f6b86' },
      { x: 510, y: 470, text: 'Disconnected path', size: 20, color: '#537255' },
      { x: 900, y: 690, text: 'DataReader stays open; DataSet lives after the connection closes', size: 18 }
    ]
  },
  {
    file: 'angular-signals-change-detection',
    title: 'Angular signals',
    subtitle: 'a dependency graph narrows change detection',
    alt: 'Hand-drawn Angular signal dependency graph',
    nodes: [
      box('signal', 110, 300, 260, 120, 'Writable signal', 'count = signal(0)', 'round', 'blue'),
      box('computed', 430, 300, 260, 120, 'computed()', 'derived value', 'round', 'green'),
      box('template', 750, 300, 260, 120, 'Template', 'reads signals', 'round', 'amber'),
      box('dom', 1070, 300, 270, 120, 'Affected views', 'minimal DOM update', 'round', 'green'),
      box('effect', 430, 570, 300, 110, 'effect()', 'sync to storage or API', 'note', 'amber'),
      box('external', 800, 570, 300, 110, 'External world', 'browser storage / server', 'note', 'blue'),
      box('graph', 1150, 570, 290, 110, 'Dependency graph', 'no zone-wide sweep', 'note', 'green')
    ],
    arrows: [
      arrow('signal', 'computed'),
      arrow('computed', 'template'),
      arrow('template', 'dom'),
      arrow('computed', 'effect', 'tracks', { dashed: true }),
      arrow('effect', 'external')
    ],
    notes: [
      { x: 300, y: 470, text: 'reads are tracked automatically', size: 18 },
      { x: 1130, y: 480, text: 'only consumers of changed signals update', size: 18 }
    ]
  },
  {
    file: 'angular-http-interceptors',
    title: 'Angular HTTP interceptors',
    subtitle: 'cross-cutting policy wrapped around HttpClient',
    alt: 'Hand-drawn Angular HTTP interceptor request and response chain',
    nodes: [
      box('component', 90, 270, 230, 100, 'Component', 'http.get()'),
      box('service', 370, 270, 230, 100, 'Data service', 'API wrapper'),
      box('http', 650, 270, 230, 100, 'HttpClient', 'request'),
      box('auth', 930, 270, 230, 100, 'Interceptor 1', 'auth header'),
      box('retry', 1210, 270, 250, 100, 'Interceptor 2', 'retry / error'),
      box('api', 1210, 540, 250, 100, 'API', 'server'),
      box('note', 90, 540, 330, 100, 'Functional interceptors', 'wrap next()', 'note', 'amber')
    ],
    arrows: [
      arrow('component', 'service'),
      arrow('service', 'http'),
      arrow('http', 'auth', 'request'),
      arrow('auth', 'retry', 'next()'),
      arrow('retry', 'api', 'send'),
      {
        points: [[1335, 540], [1335, 710], [205, 710], [205, 370]],
        label: 'response unwinds through the chain',
        labelAt: [760, 690],
        dashed: true,
        color: '#3f6b86'
      }
    ],
    notes: [
      { x: 700, y: 470, text: 'order matters: request goes in, response comes out', size: 18 }
    ]
  },
  {
    file: 'angular-di-injector-tree',
    title: 'Angular injector tree',
    subtitle: 'lookup starts local and walks upward',
    alt: 'Hand-drawn Angular root, feature, and component injector tree',
    nodes: [
      box('root', 620, 180, 330, 115, 'Root injector', 'HttpClient, Router, app services'),
      box('feature', 280, 430, 300, 115, 'Feature injector', 'route-level providers'),
      box('component', 890, 430, 310, 115, 'Component injector', 'local providers'),
      box('token', 600, 650, 370, 100, 'Lookup starts here', 'walk up until a match', 'note', 'amber'),
      box('nearest', 1050, 650, 320, 100, 'Nearest provider wins', 'child can override parent', 'note', 'green')
    ],
    arrows: [
      arrow('component', 'feature', 'not found', { dashed: true }),
      arrow('feature', 'root', 'provider found'),
      arrow('component', 'root', 'walk up', { dashed: true }),
      arrow('token', 'component', 'resolve', { dashed: true })
    ],
    notes: [
      { x: 1045, y: 610, text: 'resolution is hierarchical', size: 18 }
    ]
  },
  {
    file: 'angular-router-guards',
    title: 'Angular router guards',
    subtitle: 'match, protect, resolve, then render',
    alt: 'Hand-drawn Angular route tree with guards and lazy loading',
    nodes: [
      box('url', 90, 300, 220, 100, 'URL', '/app/orders/42', 'note', 'blue'),
      box('match', 350, 300, 250, 100, 'Route match', 'tree lookup'),
      box('guard', 650, 285, 210, 130, 'Guards', 'allowed?', 'diamond', 'amber'),
      box('resolver', 910, 300, 240, 100, 'Resolvers', 'prefetch data'),
      box('chunk', 1200, 300, 230, 100, 'Lazy chunk', 'load feature'),
      box('outlet', 1200, 540, 230, 100, 'Router outlet', 'render branch', 'box', 'green'),
      box('redirect', 650, 560, 260, 100, 'Redirect', 'CanActivate / CanMatch', 'note', 'red')
    ],
    arrows: [
      arrow('url', 'match'),
      arrow('match', 'guard'),
      arrow('guard', 'resolver', 'yes'),
      arrow('resolver', 'chunk'),
      arrow('chunk', 'outlet', 'render'),
      arrow('guard', 'redirect', 'no', { color: '#a34c3f' }),
      arrow('match', 'redirect', 'CanMatch', { dashed: true })
    ],
    notes: [
      { x: 920, y: 470, text: 'guards can redirect or cancel navigation', size: 18 }
    ]
  },
  {
    file: 'angular-bootstrap-architecture',
    title: 'Angular bootstrap',
    subtitle: 'from index.html to the router outlet',
    alt: 'Hand-drawn Angular bootstrap architecture',
    nodes: [
      box('html', 90, 300, 220, 100, 'index.html', '<app-root>'),
      box('main', 350, 300, 220, 100, 'main.ts', 'bootstrapApplication'),
      box('bootstrap', 610, 300, 260, 100, 'bootstrapApplication', 'create app'),
      box('config', 910, 300, 260, 100, 'appConfig', 'providers + router'),
      box('root', 1210, 300, 240, 100, 'Root component', 'shell'),
      box('outlet', 880, 560, 340, 100, 'router-outlet', 'route view renders here', 'note', 'green'),
      box('injector', 390, 560, 320, 100, 'Injector created', 'root services available', 'note', 'blue')
    ],
    arrows: [
      arrow('html', 'main'),
      arrow('main', 'bootstrap'),
      arrow('bootstrap', 'config', 'providers'),
      arrow('config', 'root', 'render'),
      arrow('root', 'outlet', 'route', { dashed: true }),
      arrow('bootstrap', 'injector', 'DI root', { dashed: true })
    ],
    notes: [
      { x: 220, y: 470, text: 'browser loads the host page first', size: 18 }
    ]
  },
  {
    file: 'angular-ngrx-flow',
    title: 'NgRx unidirectional flow',
    subtitle: 'actions, effects, reducers, store, selectors',
    alt: 'Hand-drawn NgRx action and store flow',
    nodes: [
      box('component', 90, 290, 230, 105, 'Component', 'view'),
      box('action', 360, 290, 230, 105, 'Action', 'dispatch'),
      box('effect', 620, 290, 240, 105, 'Effect', 'async work', 'box', 'amber'),
      box('reducer', 900, 290, 230, 105, 'Reducer', 'pure update'),
      box('store', 1170, 290, 240, 105, 'Store', 'state'),
      box('selector', 900, 560, 300, 110, 'Selector', 'memoized derived state', 'note', 'green'),
      box('api', 600, 560, 250, 110, 'API / side effect', 'HTTP, storage', 'note', 'blue')
    ],
    arrows: [
      arrow('component', 'action', 'dispatch()'),
      arrow('action', 'effect', 'handled'),
      arrow('effect', 'reducer', 'success'),
      arrow('reducer', 'store', 'new state'),
      arrow('store', 'selector', 'select'),
      arrow('effect', 'api', 'call', { dashed: true }),
      {
        points: [[1200, 615], [760, 720], [205, 720], [205, 395]],
        label: 'selected view model',
        labelAt: [390, 700],
        dashed: true,
        color: '#537255'
      }
    ]
  },
  {
    file: 'dotnet-execution',
    title: '.NET execution path',
    subtitle: 'source to IL to native code',
    alt: 'Hand-drawn .NET execution path from C# source to native code',
    nodes: [
      box('source', 90, 300, 230, 100, 'C# source', '.cs files'),
      box('roslyn', 360, 300, 230, 100, 'Roslyn', 'compile'),
      box('assembly', 630, 300, 250, 100, 'IL + assembly', '.dll / .exe'),
      box('clr', 920, 300, 230, 100, 'CoreCLR', 'load types'),
      box('jit', 1190, 300, 230, 100, 'JIT', 'compile hot paths'),
      box('native', 1030, 560, 430, 110, 'Native CPU instructions', 'only executed paths are JIT-compiled', 'note', 'green'),
      box('memory', 450, 560, 320, 110, 'Managed memory', 'GC + runtime services', 'note', 'blue')
    ],
    arrows: [
      arrow('source', 'roslyn'),
      arrow('roslyn', 'assembly', 'IL'),
      arrow('assembly', 'clr', 'load'),
      arrow('clr', 'jit', 'method call'),
      arrow('jit', 'native', 'machine code'),
      arrow('clr', 'memory', 'runtime', { dashed: true })
    ]
  },
  {
    file: 'aspnet-pipeline',
    title: 'ASP.NET Core pipeline',
    subtitle: 'request and response pass through every layer',
    alt: 'Hand-drawn ASP.NET Core middleware pipeline',
    nodes: [
      box('request', 80, 300, 220, 100, 'HTTP request', 'GET /api/notes', 'note', 'blue'),
      box('first', 350, 300, 220, 100, 'Middleware 1', 'exception handler'),
      box('second', 620, 300, 240, 100, 'Middleware 2', 'auth + CORS'),
      box('endpoint', 910, 300, 250, 100, 'Endpoint', 'controller / minimal API'),
      box('response', 1210, 300, 250, 100, 'HTTP response', 'JSON + status', 'note', 'green'),
      box('next', 540, 540, 430, 100, 'await next()', 'each layer wraps the next one', 'note', 'amber')
    ],
    arrows: [
      arrow('request', 'first'),
      arrow('first', 'second', 'next()'),
      arrow('second', 'endpoint', 'next()'),
      arrow('endpoint', 'response', 'write'),
      {
        points: [[1335, 400], [1335, 700], [190, 700], [190, 400]],
        label: 'response unwinds',
        labelAt: [1040, 680],
        dashed: true,
        color: '#3f6b86'
      }
    ],
    notes: [
      { x: 540, y: 480, text: 'middleware can short-circuit the request', size: 18, color: '#a34c3f' }
    ]
  },
  {
    file: 'dotnet-project-setup',
    title: 'Web API project setup',
    subtitle: 'layers and the request path through them',
    alt: 'Hand-drawn layered ASP.NET Core Web API project structure',
    nodes: [
      box('api', 90, 290, 240, 110, 'API', 'Controllers + endpoints'),
      box('application', 390, 290, 250, 110, 'Application', 'services + use cases'),
      box('domain', 710, 290, 240, 110, 'Domain', 'entities + rules'),
      box('infrastructure', 1020, 290, 270, 110, 'Infrastructure', 'EF Core + providers'),
      box('database', 1320, 530, 180, 150, 'Database', null, 'cylinder', 'blue'),
      box('direction', 390, 550, 560, 110, 'Dependency direction', 'API -> Application -> Domain; Infrastructure implements', 'note', 'amber')
    ],
    arrows: [
      arrow('api', 'application', 'calls'),
      arrow('application', 'domain', 'uses'),
      arrow('infrastructure', 'domain', 'implements', { dashed: true }),
      arrow('infrastructure', 'database', 'SQL'),
      {
        points: [[515, 400], [515, 470], [1150, 470], [1150, 400]],
        label: 'ports',
        labelAt: [830, 455],
        dashed: true
      }
    ]
  },
  {
    file: 'di-lifetimes',
    title: 'DI service lifetimes',
    subtitle: 'transient, scoped, and singleton',
    alt: 'Hand-drawn ASP.NET Core transient, scoped, and singleton lifetimes',
    nodes: [
      box('transient', 90, 260, 280, 110, 'Transient', 'new every resolve', 'box', 'amber'),
      box('scoped', 430, 260, 280, 110, 'Scoped', 'one per request', 'box', 'blue'),
      box('singleton', 770, 260, 280, 110, 'Singleton', 'one for app lifetime', 'box', 'green'),
      box('scope', 1110, 260, 300, 100, 'Request scope', 'one scoped instance per request', 'note', 'blue'),
      box('resolve', 430, 560, 500, 110, 'Resolve service', 'ask the root or request scope'),
      box('warning', 1010, 560, 360, 110, 'Captive dependency', 'never hold a scoped service in a singleton', 'note', 'red')
    ],
    arrows: [
      arrow('resolve', 'transient'),
      arrow('resolve', 'scoped'),
      arrow('resolve', 'singleton')
    ],
    notes: [
      { x: 180, y: 460, text: 'disposed with its scope', size: 18 },
      { x: 920, y: 460, text: 'lives until app shutdown', size: 18 }
    ]
  },
  {
    file: 'jwt-refresh',
    title: 'JWT refresh lifecycle',
    subtitle: 'short access token, long refresh token, rotation',
    alt: 'Hand-drawn JWT access token and refresh token lifecycle',
    nodes: [
      box('client', 80, 300, 220, 100, 'Client', 'access token'),
      box('auth', 350, 300, 240, 100, 'Auth API', 'login / refresh'),
      box('access', 680, 210, 300, 110, 'Access token', 'short-lived JWT', 'note', 'green'),
      box('refresh', 680, 410, 300, 110, 'Refresh token', 'long-lived + rotation', 'note', 'blue'),
      box('store', 1070, 300, 320, 110, 'Token store', 'HttpOnly cookie / secure storage', 'note', 'amber'),
      box('rotate', 1070, 550, 320, 100, 'Rotate + revoke', 'reuse detection', 'note', 'red')
    ],
    arrows: [
      arrow('client', 'auth', 'login'),
      arrow('auth', 'access', 'issue'),
      arrow('auth', 'refresh', 'issue'),
      arrow('access', 'store'),
      arrow('refresh', 'store'),
      {
        points: [[1230, 300], [1230, 155], [190, 155], [190, 300]],
        label: 'attach',
        labelAt: [700, 143],
        dashed: true
      },
      arrow('refresh', 'rotate', 'rotate', { dashed: true })
    ],
    notes: [
      { x: 400, y: 540, text: 'expired access token -> call refresh once', size: 18 }
    ]
  },
  {
    file: 'csharp-async',
    title: 'C# async and await',
    subtitle: 'the thread is released while I/O is pending',
    alt: 'Hand-drawn C# async state machine and continuation flow',
    nodes: [
      box('method', 80, 300, 250, 100, 'async method', 'await WorkAsync()'),
      box('io', 370, 300, 260, 100, 'I/O operation', 'network / disk'),
      box('released', 690, 210, 300, 110, 'Thread released', 'no blocking while pending', 'note', 'green'),
      box('complete', 690, 410, 300, 110, 'I/O completes', 'continuation scheduled', 'note', 'blue'),
      box('continuation', 1040, 300, 260, 100, 'Continuation', 'resume after await'),
      box('task', 1330, 300, 190, 100, 'Task', 'completed', 'box', 'amber'),
      box('state', 1010, 570, 430, 100, 'State machine', 'compiler-generated MoveNext()', 'note', 'plain')
    ],
    arrows: [
      arrow('method', 'io', 'await'),
      arrow('io', 'released', 'pending', { dashed: true }),
      arrow('io', 'complete', 'done'),
      arrow('complete', 'continuation'),
      arrow('continuation', 'task'),
      arrow('method', 'state', 'builds', { dashed: true })
    ],
    notes: [
      { x: 300, y: 500, text: 'the caller gets a Task immediately', size: 18 }
    ]
  },
  {
    file: 'csharp-execution',
    title: 'C# execution model',
    subtitle: 'compile once, JIT the paths you run',
    alt: 'Hand-drawn C# source to IL to CoreCLR and JIT',
    nodes: [
      box('source', 90, 300, 230, 100, 'C# source', 'Program.cs'),
      box('compiler', 360, 300, 240, 100, 'Roslyn', 'compile'),
      box('assembly', 650, 300, 260, 100, 'Assembly', 'IL + metadata'),
      box('clr', 960, 300, 230, 100, 'CoreCLR', 'load'),
      box('jit', 1240, 300, 220, 100, 'JIT', 'native code'),
      box('memory', 390, 560, 350, 110, 'Managed runtime', 'GC, exceptions, threads', 'note', 'blue'),
      box('cpu', 960, 560, 460, 110, 'Executed paths only', 'JIT compiles code as it runs', 'note', 'green')
    ],
    arrows: [
      arrow('source', 'compiler'),
      arrow('compiler', 'assembly', 'IL'),
      arrow('assembly', 'clr'),
      arrow('clr', 'jit', 'method'),
      arrow('jit', 'cpu', 'machine code'),
      arrow('clr', 'memory', 'runtime', { dashed: true })
    ]
  },
  {
    file: 'csharp-type-system',
    title: 'C# type system',
    subtitle: 'value types inline, reference types on the heap',
    alt: 'Hand-drawn C# value and reference type stack and heap layout',
    nodes: [
      box('value', 100, 280, 300, 100, 'int count = 42', 'value stored inline', 'box', 'green'),
      box('reference', 100, 430, 300, 100, 'Person p', 'reference points to heap', 'box', 'blue'),
      box('heap', 570, 270, 360, 240, 'Heap object', 'Person { Name, Age }', 'box', 'amber'),
      box('nullable', 1040, 280, 300, 100, 'int? maybe', 'nullable value type'),
      box('boxing', 1040, 450, 300, 100, 'object boxed', 'boxing copies the value', 'box', 'red')
    ],
    arrows: [
      arrow('reference', 'heap', 'points to')
    ],
    notes: [
      { x: 240, y: 210, text: 'Stack', size: 24, color: '#3f6b86' },
      { x: 740, y: 210, text: 'Heap', size: 24, color: '#b47b2c' },
      { x: 780, y: 600, text: 'structs are copied; class references are copied', size: 18 }
    ]
  },
  {
    file: 'csharp-linq',
    title: 'LINQ pipeline',
    subtitle: 'deferred work until a terminal operator',
    alt: 'Hand-drawn LINQ pipeline with deferred execution',
    nodes: [
      box('source', 80, 300, 240, 100, 'IEnumerable<T>', 'source sequence'),
      box('where', 360, 300, 220, 100, 'Where', 'filter'),
      box('select', 620, 300, 220, 100, 'Select', 'project'),
      box('order', 880, 300, 220, 100, 'OrderBy', 'sort'),
      box('list', 1140, 300, 260, 100, 'ToList()', 'terminal operator', 'box', 'amber'),
      box('deferred', 360, 560, 470, 110, 'Deferred pipeline', 'no work until a terminal operator runs', 'note', 'green'),
      box('enumerate', 880, 560, 500, 110, 'One enumeration', 'rows stream through each stage', 'note', 'blue')
    ],
    arrows: [
      arrow('source', 'where'),
      arrow('where', 'select'),
      arrow('select', 'order'),
      arrow('order', 'list'),
      arrow('where', 'deferred', 'build', { dashed: true }),
      arrow('list', 'enumerate', 'enumerate', { dashed: true })
    ]
  },
  {
    file: 'csharp-oop',
    title: 'C# object model',
    subtitle: 'encapsulation, inheritance, interfaces, dispatch',
    alt: 'Hand-drawn C# object model with base class and interfaces',
    nodes: [
      box('base', 610, 180, 340, 115, 'Base class', 'shared state + virtual methods'),
      box('derived1', 250, 400, 310, 100, 'Derived class A', 'override / extend'),
      box('derived2', 620, 400, 310, 100, 'Derived class B', 'override / extend'),
      box('iface', 1000, 400, 330, 100, 'Interface', 'contract, no state'),
      box('implementation', 1000, 590, 330, 100, 'Implementation', 'runtime dispatch'),
      box('encapsulation', 250, 600, 330, 100, 'Encapsulation', 'private state, public behavior', 'note', 'amber')
    ],
    arrows: [
      arrow('derived1', 'base', 'inherit'),
      arrow('derived2', 'base', 'inherit'),
      arrow('iface', 'implementation', 'implement'),
      arrow('base', 'iface', 'polymorphism', { dashed: true }),
      arrow('encapsulation', 'base', 'protect state', { dashed: true })
    ]
  },
  {
    file: 'ef-core-migrations',
    title: 'EF Core migrations',
    subtitle: 'model changes become versioned schema changes',
    alt: 'Hand-drawn EF Core migration flow and history table',
    nodes: [
      box('model', 80, 300, 260, 100, 'Entity model', 'DbContext + entities'),
      box('migration', 380, 300, 300, 100, 'Migration files', 'Up() / Down()', 'box', 'amber'),
      box('command', 720, 300, 260, 100, 'dotnet ef update', 'apply'),
      box('schema', 1030, 300, 300, 100, 'Database schema', 'tables + indexes'),
      box('history', 1030, 560, 340, 100, '__EFMigrationsHistory', 'applied migration ids', 'note', 'blue'),
      box('snapshot', 380, 560, 320, 100, 'Model snapshot', 'current model state', 'note', 'green')
    ],
    arrows: [
      arrow('model', 'migration', 'add migration'),
      arrow('migration', 'command', 'apply'),
      arrow('command', 'schema', 'ALTER / CREATE'),
      arrow('command', 'history', 'record'),
      arrow('migration', 'snapshot', 'compare', { dashed: true })
    ]
  },
  {
    file: 'ef-core-architecture',
    title: 'EF Core architecture',
    subtitle: 'DbContext, tracking, SQL translation, provider',
    alt: 'Hand-drawn EF Core architecture and persistence path',
    nodes: [
      box('service', 80, 300, 230, 100, 'Service', 'query / command'),
      box('context', 350, 300, 240, 100, 'DbContext', 'unit of work'),
      box('dbset', 630, 300, 230, 100, 'DbSet<T>', 'LINQ queries'),
      box('tracker', 900, 300, 250, 100, 'Change tracker', 'snapshot + state'),
      box('provider', 1190, 300, 240, 100, 'Provider', 'SQL translation'),
      box('database', 1240, 550, 190, 150, 'Database', null, 'cylinder', 'blue'),
      box('query', 620, 560, 350, 100, 'SQL + materialization', 'rows become tracked entities', 'note', 'amber')
    ],
    arrows: [
      arrow('service', 'context'),
      arrow('context', 'dbset', 'query'),
      arrow('dbset', 'tracker', 'materialize'),
      arrow('tracker', 'provider', 'SaveChanges'),
      arrow('provider', 'database', 'SQL'),
      arrow('context', 'query', 'identity map', { dashed: true }),
      arrow('query', 'tracker', 'state', { dashed: true })
    ]
  },
  {
    file: 'javascript-prototype-chain',
    title: 'JavaScript prototype chain',
    subtitle: 'property lookup walks up until it finds a match',
    alt: 'Hand-drawn JavaScript prototype chain',
    nodes: [
      box('instance', 80, 300, 230, 100, 'student', '{ name }'),
      box('studentProto', 350, 300, 280, 100, 'Student.prototype', 'study()'),
      box('personProto', 670, 300, 280, 100, 'Person.prototype', 'walk()'),
      box('objectProto', 990, 300, 280, 100, 'Object.prototype', 'toString()'),
      box('null', 1310, 300, 180, 100, 'null', 'end of chain', 'note', 'plain'),
      box('thisBinding', 350, 560, 400, 110, 'this binding', 'chosen by the call site', 'note', 'amber'),
      box('lookup', 800, 560, 480, 110, 'Property lookup walks up', 'stop at the first match', 'note', 'green')
    ],
    arrows: [
      arrow('instance', 'studentProto', '__proto__'),
      arrow('studentProto', 'personProto', '__proto__'),
      arrow('personProto', 'objectProto', '__proto__'),
      arrow('objectProto', 'null', '__proto__'),
      arrow('thisBinding', 'instance', 'call', { dashed: true }),
      arrow('lookup', 'instance', 'start', { dashed: true })
    ],
    notes: [
      { x: 1030, y: 470, text: 'each link points to the next prototype', size: 18 }
    ]
  },
  {
    file: 'javascript-event-loop',
    title: 'JavaScript event loop',
    subtitle: 'microtasks drain before the next macrotask',
    alt: 'Hand-drawn JavaScript event loop with queues and render cycle',
    nodes: [
      box('stack', 80, 250, 280, 120, 'Call stack', 'sync frames'),
      box('webapis', 440, 250, 300, 120, 'Web APIs', 'timers, fetch, DOM'),
      box('micro', 820, 250, 300, 120, 'Microtask queue', 'promises'),
      box('macro', 820, 480, 300, 120, 'Macrotask queue', 'setTimeout, events'),
      box('loop', 440, 480, 300, 120, 'Event loop', 'pick one task'),
      box('render', 1220, 250, 280, 120, 'Render', 'paint when due', 'note', 'green'),
      box('drain', 1220, 480, 280, 120, 'Drain microtasks', 'before next macrotask', 'note', 'amber')
    ],
    arrows: [
      arrow('stack', 'webapis', 'async call'),
      arrow('webapis', 'micro', 'promise'),
      arrow('webapis', 'macro', 'timer'),
      arrow('loop', 'stack', 'push'),
      arrow('loop', 'macro', 'next'),
      arrow('loop', 'micro', 'drain', { dashed: true }),
      arrow('loop', 'render', 'frame', { dashed: true })
    ]
  },
  {
    file: 'react-reconciliation',
    title: 'React reconciliation',
    subtitle: 'stable keys preserve identity',
    alt: 'Hand-drawn React keyed reconciliation comparison',
    nodes: [
      box('old', 80, 250, 430, 200, 'Old list', 'A  B  C', 'box', 'blue'),
      box('next', 590, 250, 380, 200, 'New list', 'A  C  B  D', 'box', 'green'),
      box('diff', 1040, 250, 420, 200, 'Keyed diff', 'stable keys preserve identity', 'box', 'amber'),
      box('bad', 80, 560, 410, 110, 'Without keys', 'indexes shift and rows rewrite', 'note', 'red'),
      box('good', 570, 560, 410, 110, 'With keys', 'move existing nodes', 'note', 'green'),
      box('commit', 1060, 560, 400, 110, 'Minimal DOM work', 'insert / move / remove', 'note', 'blue')
    ],
    arrows: [
      {
        points: [[295, 250], [295, 195], [1250, 195], [1250, 250]],
        label: 'compare',
        labelAt: [770, 178]
      },
      {
        points: [[780, 250], [780, 222], [1120, 222], [1120, 250]]
      },
      arrow('diff', 'good', 'reuse', { dashed: true }),
      arrow('old', 'bad', 'avoid', { dashed: true }),
      arrow('good', 'commit', 'patch')
    ]
  },
  {
    file: 'react-hooks-lifecycle',
    title: 'React hooks lifecycle',
    subtitle: 'render, commit, paint, effects, cleanup',
    alt: 'Hand-drawn React render and effect ordering',
    nodes: [
      box('render', 80, 300, 220, 100, 'Render', 'calculate JSX'),
      box('commit', 340, 300, 220, 100, 'Commit', 'apply DOM'),
      box('layout', 600, 300, 240, 100, 'Layout effect', 'useLayoutEffect'),
      box('paint', 880, 300, 210, 100, 'Paint', 'browser frame'),
      box('passive', 1130, 300, 260, 100, 'Passive effect', 'useEffect'),
      box('cleanup', 600, 560, 400, 110, 'Cleanup', 'runs before the next effect', 'note', 'amber'),
      box('refs', 1130, 560, 260, 110, 'Refs / state', 'available after commit', 'note', 'green')
    ],
    arrows: [
      arrow('render', 'commit', 'changes'),
      arrow('commit', 'layout', 'before paint'),
      arrow('layout', 'paint'),
      arrow('paint', 'passive', 'after paint'),
      arrow('passive', 'cleanup', 'rerun', { dashed: true }),
      arrow('cleanup', 'passive', 'next run', { dashed: true })
    ]
  },
  {
    file: 'react-data-flow',
    title: 'React data flow',
    subtitle: 'props down, events up, context across',
    alt: 'Hand-drawn React one-way data flow',
    nodes: [
      box('parent', 500, 210, 320, 110, 'Parent state', 'source of truth'),
      box('child', 230, 450, 310, 100, 'Child', 'props down'),
      box('callback', 620, 450, 310, 100, 'Callback', 'events up'),
      box('sibling', 1010, 450, 300, 100, 'Sibling', 'receives props'),
      box('context', 1030, 210, 310, 110, 'Context', 'skip deep prop drilling', 'note', 'amber'),
      box('rerender', 500, 650, 320, 100, 'Re-render', 'changed state flows again', 'note', 'green')
    ],
    arrows: [
      arrow('parent', 'child', 'props'),
      arrow('child', 'callback', 'event'),
      arrow('callback', 'parent', 'setState'),
      arrow('parent', 'sibling', 'props'),
      arrow('context', 'sibling', 'consume', { dashed: true }),
      {
        points: [[820, 700], [1420, 700], [1420, 180], [660, 180], [660, 210]],
        label: 'state',
        labelAt: [1120, 685],
        dashed: true
      }
    ]
  },
  {
    file: 'react-router-tree',
    title: 'React Router tree',
    subtitle: 'parent routes render shared layout',
    alt: 'Hand-drawn React Router nested route tree',
    nodes: [
      box('root', 560, 180, 320, 100, 'Root layout', 'header + Outlet'),
      box('dashboard', 300, 390, 300, 100, 'Dashboard layout', 'sidebar + Outlet'),
      box('index', 100, 620, 240, 100, 'Index route', '/'),
      box('reports', 380, 620, 260, 100, 'Reports', '/reports'),
      box('settings', 680, 620, 260, 100, 'Settings', '/settings'),
      box('outlet', 990, 390, 390, 100, 'Nearest Outlet', 'child route renders here', 'note', 'green')
    ],
    arrows: [
      arrow('dashboard', 'root', 'child'),
      arrow('index', 'dashboard', 'child'),
      arrow('reports', 'dashboard', 'child'),
      arrow('settings', 'dashboard', 'child'),
      arrow('dashboard', 'outlet', 'render', { dashed: true })
    ]
  },
  {
    file: 'react-render-pipeline',
    title: 'React render pipeline',
    subtitle: 'state change to committed pixels',
    alt: 'Hand-drawn React render pipeline',
    nodes: [
      box('state', 80, 300, 240, 100, 'State update', 'setState / dispatch'),
      box('render', 350, 300, 240, 100, 'Render', 'call components'),
      box('reconcile', 630, 300, 260, 100, 'Reconcile', 'diff fiber tree'),
      box('commit', 930, 300, 240, 100, 'Commit', 'mutate DOM'),
      box('effects', 1210, 300, 240, 100, 'Effects', 'useEffect / paint'),
      box('bail', 630, 560, 400, 110, 'Bail out', 'same output can skip work', 'note', 'amber'),
      box('paint', 1080, 560, 390, 110, 'Browser paint', 'after commit', 'note', 'green')
    ],
    arrows: [
      arrow('state', 'render'),
      arrow('render', 'reconcile'),
      arrow('reconcile', 'commit', 'changes'),
      arrow('commit', 'effects'),
      arrow('reconcile', 'bail', 'no changes', { dashed: true }),
      arrow('commit', 'paint', 'frame', { dashed: true })
    ]
  },
  {
    file: 'react-fiber',
    title: 'React Fiber',
    subtitle: 'interruptible work with priority lanes',
    alt: 'Hand-drawn React Fiber tree, work loop, and priority lanes',
    nodes: [
      box('fiber', 80, 300, 300, 120, 'Fiber tree', 'linked units of work'),
      box('loop', 430, 300, 300, 120, 'Work loop', 'interruptible render'),
      box('lanes', 780, 300, 300, 120, 'Priority lanes', 'urgent work first'),
      box('commit', 1130, 300, 300, 120, 'Commit', 'sync DOM update'),
      box('yield', 430, 560, 320, 110, 'Yield', 'give time back to browser', 'note', 'amber'),
      box('resume', 800, 560, 320, 110, 'Resume', 'continue where it stopped', 'note', 'green')
    ],
    arrows: [
      arrow('fiber', 'loop', 'units'),
      arrow('loop', 'lanes', 'schedule'),
      arrow('lanes', 'commit', 'finish'),
      arrow('loop', 'yield', 'interrupt', { dashed: true }),
      arrow('yield', 'resume', 'later', { dashed: true }),
      arrow('resume', 'loop', 'continue', { dashed: true })
    ]
  },
  {
    file: 'redux-async-lifecycle',
    title: 'Redux async lifecycle',
    subtitle: 'thunks keep async work outside reducers',
    alt: 'Hand-drawn Redux async thunk lifecycle',
    nodes: [
      box('dispatch', 80, 300, 250, 100, 'dispatch(thunk)', 'event intent'),
      box('thunk', 390, 300, 280, 100, 'Async payload', 'API call'),
      box('pending', 760, 200, 260, 100, 'pending', 'loading', 'note', 'amber'),
      box('fulfilled', 760, 360, 260, 100, 'fulfilled', 'data', 'note', 'green'),
      box('rejected', 760, 520, 260, 100, 'rejected', 'error', 'note', 'red'),
      box('reducer', 1100, 300, 270, 100, 'Slice reducer', 'update state'),
      box('store', 1100, 520, 270, 100, 'Store', 'settled state', 'box', 'blue')
    ],
    arrows: [
      arrow('dispatch', 'thunk'),
      arrow('thunk', 'pending'),
      arrow('thunk', 'fulfilled'),
      arrow('thunk', 'rejected'),
      arrow('fulfilled', 'reducer'),
      arrow('rejected', 'reducer'),
      arrow('pending', 'reducer'),
      arrow('reducer', 'store')
    ]
  },
  {
    file: 'redux-data-flow',
    title: 'Redux data flow',
    subtitle: 'actions describe intent, reducers calculate state',
    alt: 'Hand-drawn Redux action, reducer, store, and selector loop',
    nodes: [
      box('ui', 80, 300, 240, 100, 'UI event', 'click / submit'),
      box('action', 360, 300, 240, 100, 'Action', '{ type, payload }'),
      box('middleware', 640, 300, 260, 100, 'Middleware', 'thunk / logger'),
      box('reducer', 940, 300, 240, 100, 'Reducer', 'pure state update'),
      box('store', 1220, 300, 250, 100, 'Store', 'single state tree'),
      box('selector', 940, 560, 300, 100, 'Selector', 'derived value'),
      box('view', 360, 560, 400, 100, 'View re-renders', 'subscribers notified', 'box', 'green')
    ],
    arrows: [
      arrow('ui', 'action', 'dispatch'),
      arrow('action', 'middleware'),
      arrow('middleware', 'reducer', 'next'),
      arrow('reducer', 'store', 'new state'),
      arrow('store', 'selector', 'select'),
      arrow('selector', 'view', 'props'),
      arrow('view', 'ui', 'interaction', { dashed: true })
    ]
  },
  {
    file: 'tanstack-query-lifecycle',
    title: 'TanStack Query lifecycle',
    subtitle: 'cache identity, freshness, and background refetch',
    alt: 'Hand-drawn TanStack Query cache lifecycle',
    nodes: [
      box('key', 80, 260, 250, 100, 'Query key', '["notes", id]'),
      box('cache', 370, 260, 270, 100, 'Cache entry', 'data + timestamps'),
      box('fresh', 680, 245, 210, 130, 'Fresh?', 'decision', 'diamond', 'amber'),
      box('render', 970, 260, 240, 100, 'Render data', 'instant cache hit'),
      box('fetch', 970, 440, 240, 100, 'Background fetch', 'revalidate', 'box', 'blue'),
      box('stale', 620, 560, 380, 110, 'staleTime / gcTime', 'staleness and cleanup', 'note', 'green'),
      box('triggers', 1040, 610, 390, 100, 'Refetch triggers', 'mount, focus, reconnect, interval', 'note', 'plain')
    ],
    arrows: [
      arrow('key', 'cache', 'lookup'),
      arrow('cache', 'fresh'),
      arrow('fresh', 'render', 'yes'),
      arrow('fresh', 'fetch', 'stale'),
      arrow('fetch', 'render', 'update', { dashed: true }),
      arrow('cache', 'stale', 'policy', { dashed: true }),
      arrow('fetch', 'triggers', 'causes', { dashed: true })
    ]
  },
  {
    file: 'tanstack-mutation-lifecycle',
    title: 'TanStack mutation lifecycle',
    subtitle: 'optimistic write, rollback, and reconciliation',
    alt: 'Hand-drawn TanStack Query mutation lifecycle',
    nodes: [
      box('trigger', 80, 300, 250, 100, 'mutate(vars)', 'start mutation'),
      box('onmutate', 380, 300, 330, 100, 'onMutate', 'snapshot + optimistic write', 'box', 'amber'),
      box('success', 760, 210, 300, 100, 'Success', 'invalidate queries', 'box', 'green'),
      box('error', 760, 410, 300, 100, 'Error', 'rollback snapshot', 'box', 'red'),
      box('settled', 1120, 300, 290, 100, 'onSettled', 'cleanup + reconcile'),
      box('snapshot', 380, 560, 400, 110, 'Cache snapshot', 'previous data is kept for rollback', 'note', 'blue')
    ],
    arrows: [
      arrow('trigger', 'onmutate', 'optimistic'),
      arrow('onmutate', 'success', 'resolve'),
      arrow('onmutate', 'error', 'reject'),
      arrow('success', 'settled'),
      arrow('error', 'settled'),
      arrow('onmutate', 'snapshot', 'save', { dashed: true }),
      arrow('snapshot', 'error', 'restore', { dashed: true, labelAt: [930, 540] })
    ]
  }
];
