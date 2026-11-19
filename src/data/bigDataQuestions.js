export const FLASHCARDS = [
  {
    id: 1,
    category: "Integridad y Tipos",
    term: "INT IDENTITY(1,1)",
    subtitle: "Clave autoincremental de 32 bits",
    definition: "Propiedad que genera automáticamente valores enteros secuenciales en cada inserción. El primer parámetro es la semilla inicial y el segundo el incremento por fila, eliminando colisiones manuales en llaves subrogadas.",
    code: "ID_CITA INT IDENTITY(1,1) PRIMARY KEY"
  },
  {
    id: 2,
    category: "Integridad y Tipos",
    term: "PRIMARY KEY",
    subtitle: "Integridad de entidad única",
    definition: "Restricción que identifica unívocamente cada registro de una tabla. Garantiza unicidad, impide valores NULL y crea por defecto un índice agrupado (clustered) en SQL Server.",
    code: "CONSTRAINT PK_Cliente PRIMARY KEY (ID_Cliente)"
  },
  {
    id: 3,
    category: "Integridad y Tipos",
    term: "FOREIGN KEY",
    subtitle: "Integridad referencial maestro-detalle",
    definition: "Restricción que enlaza una columna con la PRIMARY KEY o UNIQUE de otra tabla, asegurando que toda referencia apunte a un registro padre válido y evitando filas huérfanas.",
    code: "FOREIGN KEY (ID_Marca) REFERENCES Marca(ID_Marca)"
  },
  {
    id: 4,
    category: "Integridad y Tipos",
    term: "UNIQUE",
    subtitle: "Unicidad en columnas no primarias",
    definition: "Restricción que prohíbe duplicados en atributos clave de negocio (como DNI, RUC o correo). A diferencia de PRIMARY KEY, SQL Server sí admite un único valor NULL en la columna.",
    code: "DNI VARCHAR(8) NOT NULL CONSTRAINT UQ_Paciente_DNI UNIQUE"
  },
  {
    id: 5,
    category: "Integridad y Tipos",
    term: "CHECK",
    subtitle: "Validación de dominio en el motor",
    definition: "Restricción que evalúa una expresión lógica antes de confirmar un INSERT o UPDATE. Permite validar estados, tipos de documento o montos válidos directamente a nivel de base de datos.",
    code: "CONSTRAINT CK_Comprobante_Total CHECK (Total >= 0)"
  },
  {
    id: 6,
    category: "Integridad y Tipos",
    term: "BIT",
    subtitle: "Tipo entero booleano compacto",
    definition: "Tipo de dato numérico exacto que almacena 0 (falso), 1 (verdadero) o NULL. SQL Server optimiza espacio agrupando hasta 8 columnas BIT de una tabla en un mismo byte.",
    code: "Activo BIT NOT NULL CONSTRAINT DF_Activo DEFAULT (1)"
  },
  {
    id: 7,
    category: "T-SQL y Ventana",
    term: "LTRIM() / RTRIM()",
    subtitle: "Limpieza de espacios en cadenas",
    definition: "Eliminan espacios en blanco al inicio (LTRIM) y al final (RTRIM) de un texto. Son esenciales durante la fase de transformación ETL para homogeneizar nombres y códigos antes de cargar el Data Mart.",
    code: "SELECT LTRIM(RTRIM(NombreCliente)) AS ClienteLimpio;"
  },
  {
    id: 8,
    category: "Integridad y Tipos",
    term: "NULL / NOT NULL",
    subtitle: "Control de nulabilidad",
    definition: "NULL representa dato desconocido o ausente (distinto de 0 o cadena vacía). Declarar NOT NULL exige que toda fila insertada suministre un valor obligatorio.",
    code: "FechaEmision DATETIME2 NOT NULL, Notas VARCHAR(200) NULL"
  },
  {
    id: 9,
    category: "Integridad y Tipos",
    term: "IS NULL / IS NOT NULL",
    subtitle: "Evaluación en lógica trivaluada",
    definition: "Operador obligatorio para filtrar valores nulos en SQL. Comparar con \"= NULL\" devuelve UNKNOWN y no retorna filas; siempre debe emplearse IS NULL o IS NOT NULL.",
    code: "SELECT * FROM Comprobante WHERE FechaAnulacion IS NULL;"
  },
  {
    id: 10,
    category: "T-SQL y Ventana",
    term: "CREATE OR ALTER VIEW",
    subtitle: "Vistas virtuales idempotentes",
    definition: "Crea una vista almacenada o actualiza su definición sin eliminar permisos ni propiedades extendidas previas. Ideal para exponer consultas de negocio o vistas de metadatos del catálogo del sistema.",
    code: "CREATE OR ALTER VIEW dbo.vw_Metadatos AS\nSELECT s.name AS esquema, t.name AS tabla FROM sys.tables t\nINNER JOIN sys.schemas s ON s.schema_id = t.schema_id;"
  },
  {
    id: 11,
    category: "T-SQL y Ventana",
    term: "RANK() OVER (...)",
    subtitle: "Función de ventana con saltos en empate",
    definition: "Asigna un número de posición dentro de cada partición ordenada. Si dos filas empatan, reciben el mismo rango y la siguiente posición salta el número correspondiente (ej. 1, 1, 3).",
    code: "RANK() OVER (PARTITION BY Marca ORDER BY Venta DESC) AS Puesto"
  },
  {
    id: 12,
    category: "T-SQL y Ventana",
    term: "COUNT_BIG()",
    subtitle: "Conteo masivo de 64 bits",
    definition: "Devuelve la cantidad de filas en tipo bigint en lugar de int. Resulta indispensable en tablas de Big Data o Data Warehouse que superan los 2.14 mil millones de registros y es obligatoria en vistas indexadas.",
    code: "SELECT COUNT_BIG(*) AS TotalMovimientos FROM FactVentas;"
  },
  {
    id: 13,
    category: "T-SQL y Ventana",
    term: "CONCAT()",
    subtitle: "Concatenación segura ante nulos",
    definition: "Une dos o más valores convirtiéndolos implícitamente a texto y tratando cualquier NULL como cadena vacía, evitando que un dato faltante anule todo el resultado como sucede con el operador \"+\".",
    code: "SELECT CONCAT(Nombres, ' ', Apellidos) AS NombreCompleto;"
  },
  {
    id: 14,
    category: "T-SQL y Ventana",
    term: "CAST(expr AS tipo)",
    subtitle: "Conversión explícita estándar ANSI",
    definition: "Convierte una expresión de un tipo de dato a otro de forma explícita. Muy utilizado en mensajes de auditoría y reportes para transformar números o fechas a VARCHAR.",
    code: "'Cita N° ' + CAST(d.ID_CITA AS VARCHAR(12))"
  },
  {
    id: 15,
    category: "T-SQL y Ventana",
    term: "INNER JOIN",
    subtitle: "Intersección exacta entre tablas",
    definition: "Retorna exclusivamente las filas que cumplen la condición de unión en ambas tablas. Es la combinación estándar para vincular tablas de catálogo con sus tablas transaccionales o de metadatos.",
    code: "FROM sys.tables t INNER JOIN sys.columns c ON c.object_id = t.object_id"
  },
  {
    id: 16,
    category: "T-SQL y Ventana",
    term: "LEFT JOIN",
    subtitle: "Preservación de la tabla izquierda",
    definition: "Devuelve todas las filas de la tabla izquierda junto con sus coincidencias de la derecha; cuando no existe coincidencia, rellena los campos derechos con NULL.",
    code: "SELECT c.Nombre, p.ID_Pedido FROM Cliente c\nLEFT JOIN Pedido p ON p.ID_Cliente = c.ID_Cliente;"
  },
  {
    id: 17,
    category: "T-SQL y Ventana",
    term: "FULL OUTER JOIN",
    subtitle: "Unión completa con nulos en ambos lados",
    definition: "Incluye todas las filas de ambas tablas aunque no tengan pareja. Es muy útil en auditorías y procesos ETL para conciliar diferencias entre el sistema origen y el Data Warehouse.",
    code: "SELECT * FROM Origen o FULL OUTER JOIN Destino d ON o.SKU = d.SKU;"
  },
  {
    id: 18,
    category: "T-SQL y Ventana",
    term: "CROSS APPLY OPENJSON",
    subtitle: "Expansión relacional de JSON",
    definition: "Invoca la función con valor de tabla OPENJSON por cada fila externa, descomponiendo documentos o arreglos JSON semiestructurados en columnas y filas consultables en SQL Server.",
    code: "SELECT v.ID, j.sku, j.qty FROM VentasRaw v\nCROSS APPLY OPENJSON(v.Payload) WITH (sku VARCHAR(20), qty INT) j;"
  },
  {
    id: 19,
    category: "T-SQL y Ventana",
    term: "GROUP BY ROLLUP",
    subtitle: "Subtotales jerárquicos acumulados",
    definition: "Genera agregaciones de derecha a izquierda según la jerarquía de columnas indicada, produciendo subtotales parciales por cada nivel y una fila final con el gran total.",
    code: "SELECT Anio, Mes, SUM(Total) FROM FactVentas GROUP BY ROLLUP (Anio, Mes);"
  },
  {
    id: 20,
    category: "T-SQL y Ventana",
    term: "PIVOT",
    subtitle: "Rotación de filas a columnas",
    definition: "Transforma valores distintos de una columna en encabezados de columnas individuales mientras agrega métricas numéricas, facilitando reportes matriciales por canal o periodo.",
    code: "SELECT * FROM BaseMensual PIVOT (SUM(Monto) FOR Canal IN ([Web],[Tienda])) p;"
  },
  {
    id: 21,
    category: "T-SQL y Ventana",
    term: "OPTION (MAXDOP N)",
    subtitle: "Límite de paralelismo de CPU",
    definition: "Directiva que restringe la cantidad máxima de núcleos lógicos que una consulta puede usar simultáneamente, protegiendo al servidor OLTP/analítico contra saturación de hilos.",
    code: "SELECT Marca, SUM(Total) FROM FactVentas GROUP BY Marca OPTION (MAXDOP 4);"
  },
  {
    id: 22,
    category: "Triggers y Cursores",
    term: "@@FETCH_STATUS",
    subtitle: "Estado de lectura de un cursor",
    definition: "Función del sistema que reporta el resultado del último FETCH ejecutado. Devuelve 0 cuando la fila fue recuperada con éxito (condición del bucle WHILE), -1 al llegar al final y -2 si la fila ya no existe.",
    code: "WHILE @@FETCH_STATUS = 0\nBEGIN\n  FETCH NEXT FROM c_Resumen INTO @esp, @total;\nEND"
  },
  {
    id: 23,
    category: "Triggers y Cursores",
    term: "inserted / deleted",
    subtitle: "Tablas lógicas temporales en Triggers",
    definition: "Tablas en memoria creadas por SQL Server durante un Trigger DML. INSERT puebla inserted; DELETE puebla deleted; UPDATE guarda el estado previo en deleted y el nuevo en inserted.",
    code: "SELECT d.ESTADO AS Anterior, i.ESTADO AS Nuevo\nFROM deleted d INNER JOIN inserted i ON d.ID_CITA = i.ID_CITA;"
  },
  {
    id: 24,
    category: "Triggers y Cursores",
    term: "RAISERROR / ROLLBACK",
    subtitle: "Reversión y notificación de error",
    definition: "ROLLBACK TRANSACTION deshace todos los cambios de la transacción activa cuando se infringe una regla (ej. horario restringido), y RAISERROR(..., 16, 1) devuelve el mensaje de error al cliente.",
    code: "ROLLBACK TRANSACTION;\nRAISERROR('RESTRICCION: Fuera de horario (08:00-20:00).', 16, 1);"
  },
  {
    id: 25,
    category: "Triggers y Cursores",
    term: "BEGIN TRY ... BEGIN CATCH",
    subtitle: "Transacciones con manejo de excepciones",
    definition: "Bloque estructurado indispensable en procedimientos almacenados transaccionales. Si ocurre un error en TRY, el control pasa a CATCH para ejecutar ROLLBACK seguro y registrar o relanzar el fallo.",
    code: "BEGIN TRY BEGIN TRAN; ... COMMIT TRAN; END TRY\nBEGIN CATCH IF @@TRANCOUNT > 0 ROLLBACK TRAN; THROW; END CATCH"
  },
  {
    id: 26,
    category: "Triggers y Cursores",
    term: "CLOSE / DEALLOCATE",
    subtitle: "Cierre y liberación de cursores",
    definition: "Tras recorrer filas con DECLARE, OPEN y FETCH, CLOSE cierra el conjunto activo liberando bloqueos y DEALLOCATE destruye la referencia y memoria asignada al cursor.",
    code: "CLOSE c_ResumenEspecialidad;\nDEALLOCATE c_ResumenEspecialidad;"
  },
  {
    id: 27,
    category: "Triggers y Cursores",
    term: "AFTER vs INSTEAD OF Trigger",
    subtitle: "Momento de ejecución del desencadenador",
    definition: "AFTER (FOR) corre después de validar restricciones y aplicar la operación DML; INSTEAD OF intercepta y sustituye la acción original (permitiendo lógica personalizada incluso sobre vistas). Ambos admiten varchar(MAX) en inserted/deleted.",
    code: "CREATE OR ALTER TRIGGER TRG_AUDITORIA_CITAS\nON CITA_MEDICA FOR UPDATE, DELETE AS ..."
  },
  {
    id: 28,
    category: "Big Data y BI",
    term: "Proceso ETL",
    subtitle: "Extracción, Transformación y Carga",
    definition: "Flujo de integración que extrae datos crudos de fuentes operativas (ej. CSV, WooCommerce, Stripe), los limpia y estandariza en Transformación, y los carga en el Data Mart o Data Warehouse para análisis.",
    code: "Fuentes (CSV/OLTP) -> Limpieza y Homogeneización -> Data Mart"
  },
  {
    id: 29,
    category: "Big Data y BI",
    term: "Modelo Dimensional en Estrella",
    subtitle: "Arquitectura analítica Kimball",
    definition: "Esquema optimizado para BI donde una tabla central de Hechos (FactVentas con métricas y llaves) se conecta directamente a tablas de Dimensiones desnormalizadas (DimCliente, DimProducto, DimTiempo).",
    code: "FactVentas (Cantidad, Total) -> DimCliente, DimEmpleado, DimTiempo"
  },
  {
    id: 30,
    category: "Big Data y BI",
    term: "Índices Dispersos vs Parciales (MongoDB)",
    subtitle: "Indexación selectiva en NoSQL",
    definition: "En bases documentales sin esquema rígido (MongoDB), los índices dispersos solo indexan documentos donde existe el campo; los índices parciales filtran entradas según una condición explícita más rica sobre cualquier campo.",
    code: "db.col.createIndex({sku: 1}, {partialFilterExpression: {stock: {$gt: 0}}})"
  }
];

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    topic: "Integridad y Tipos",
    stem: "En la definición ID_CITA INT IDENTITY(10, 5), ¿qué representan exactamente los argumentos (10, 5)?",
    code: "",
    options: [
      "Valor inicial (semilla) 10 e incremento de 5 en cada nueva fila insertada.",
      "Mínimo 10 dígitos de longitud y máximo 5 valores nulos permitidos.",
      "Incremento de 10 en 10 comenzando desde el número 5."
    ],
    correct: 0,
    explanation: "El primer parámetro de IDENTITY(seed, increment) establece el valor inicial de la secuencia (10) y el segundo define cuánto suma el motor en cada nuevo INSERT (5)."
  },
  {
    id: 2,
    topic: "Integridad y Tipos",
    stem: "¿Cuál es la diferencia fundamental entre una restricción PRIMARY KEY y una restricción UNIQUE en SQL Server?",
    code: "",
    options: [
      "UNIQUE permite un valor NULL y una tabla puede tener varias; PRIMARY KEY prohíbe NULL y solo hay una por tabla.",
      "PRIMARY KEY no valida duplicados, mientras que UNIQUE valida duplicados en todas las tablas del esquema.",
      "UNIQUE convierte automáticamente la columna en tipo BIT, mientras PRIMARY KEY exige INT."
    ],
    correct: 0,
    explanation: "Cada tabla posee una única PRIMARY KEY que rechaza NULL; en cambio, puedes definir múltiples restricciones UNIQUE (por ejemplo para DNI y correo) y SQL Server admite un único valor NULL por columna UNIQUE."
  },
  {
    id: 3,
    topic: "Integridad y Tipos",
    stem: "¿Qué garantiza una restricción FOREIGN KEY entre DetalleComprobante y Comprobante?",
    code: "",
    options: [
      "Que no puedan insertarse detalles apuntando a un ID_Comprobante inexistente (integridad referencial).",
      "Que la tabla DetalleComprobante ordene automáticamente sus filas por fecha de emisión.",
      "Que los precios unitarios del detalle sean siempre mayores que cero."
    ],
    correct: 0,
    explanation: "FOREIGN KEY protege la integridad referencial exigiendo que cada clave foránea coincida con una clave primaria o única existente en la tabla padre."
  },
  {
    id: 4,
    topic: "Integridad y Tipos",
    stem: "Si una tabla tiene CONSTRAINT CK_Monto CHECK (Monto > 0) y se intenta insertar Monto = -15, ¿qué ocurre?",
    code: "",
    options: [
      "El motor rechaza la operación y lanza un error de conflicto con la restricción CHECK.",
      "SQL Server convierte -15 a 0 automáticamente y completa la inserción.",
      "La fila se inserta con Monto en NULL."
    ],
    correct: 0,
    explanation: "Las restricciones de dominio CHECK validan reglas de negocio en el motor antes de confirmar el cambio; si la expresión resulta FALSE, la sentencia falla."
  },
  {
    id: 5,
    topic: "Integridad y Tipos",
    stem: "¿Qué valores puede almacenar una columna declarada como BIT NULL en SQL Server?",
    code: "",
    options: [
      "Únicamente 0, 1 o NULL.",
      "Cualquier carácter alfabético de un solo byte ('S' o 'N').",
      "Enteros entre -128 y 127."
    ],
    correct: 0,
    explanation: "BIT es un tipo entero booleano que admite 0, 1 (cualquier valor distinto de cero se convierte a 1) y NULL si la columna es anulable."
  },
  {
    id: 6,
    topic: "T-SQL y Ventana",
    stem: "Durante la limpieza ETL de datos crudos, ¿para qué se aplica LTRIM(RTRIM(col))?",
    code: "",
    options: [
      "Para eliminar espacios en blanco residuales tanto al inicio como al final de la cadena.",
      "Para convertir toda la cadena a mayúsculas y eliminar tildes.",
      "Para reemplazar valores NULL por ceros numéricos."
    ],
    correct: 0,
    explanation: "LTRIM elimina espacios a la izquierda y RTRIM a la derecha, evitando duplicados falsos por formato en dimensiones como Cliente o Marca."
  },
  {
    id: 7,
    topic: "Integridad y Tipos",
    stem: "¿Por qué la condición WHERE FechaAnulacion = NULL no devuelve filas aunque existan registros sin anular?",
    code: "",
    options: [
      "Porque en lógica trivaluada cualquier comparación con \"=\" frente a NULL resulta UNKNOWN; debe usarse IS NULL.",
      "Porque las columnas de tipo fecha no soportan el operador \"=\" en SQL Server.",
      "Porque SQL Server exige usar LIKE '%NULL%' para detectar campos vacíos."
    ],
    correct: 0,
    explanation: "NULL representa ausencia de valor, no un dato comparable con igualdad aritmética. Siempre debe evaluarse mediante IS NULL o IS NOT NULL."
  },
  {
    id: 8,
    topic: "T-SQL y Ventana",
    stem: "¿Qué ventaja ofrece CREATE OR ALTER VIEW frente a ejecutar DROP VIEW seguido de CREATE VIEW?",
    code: "CREATE OR ALTER VIEW dbo.vw_Metadatos AS\nSELECT s.name AS esquema, t.name AS tabla\nFROM sys.tables t INNER JOIN sys.schemas s ON s.schema_id = t.schema_id;",
    options: [
      "Actualiza la consulta de forma idempotente conservando los permisos asignados sobre la vista.",
      "Convierte automáticamente la vista en una tabla física replicada.",
      "Permite omitir la cláusula SELECT dentro de la definición."
    ],
    correct: 0,
    explanation: "CREATE OR ALTER VIEW modifica la definición de la vista si ya existe sin destruir el objeto ni borrar los permisos (GRANT) otorgados previamente."
  },
  {
    id: 9,
    topic: "T-SQL y Ventana",
    stem: "Si aplicas RANK() OVER (ORDER BY Ventas DESC) y dos marcas empatan en primer lugar con 500 unidades, ¿qué rango recibe la tercera marca con 420 unidades?",
    code: "",
    options: [
      "3, porque RANK() deja un salto equivalente a la cantidad de filas empatadas.",
      "2, porque el rango siempre avanza de uno en uno sin saltos.",
      "NULL, porque los empates anulan la numeración posterior."
    ],
    correct: 0,
    explanation: "RANK() asigna 1, 1 y salta al 3. Si no se desearan saltos tras un empate (1, 1, 2), se emplearía DENSE_RANK()."
  },
  {
    id: 10,
    topic: "T-SQL y Ventana",
    stem: "¿Cuándo es necesario o recomendable utilizar COUNT_BIG(*) en lugar de COUNT(*)?",
    code: "",
    options: [
      "Cuando la tabla supera el límite de INT (~2.14 mil millones de filas) o al crear vistas indexadas con agregación.",
      "Únicamente cuando la tabla contiene columnas de tipo VARCHAR(MAX).",
      "Cuando se desea contar solo los valores nulos de una columna."
    ],
    correct: 0,
    explanation: "COUNT_BIG devuelve un entero de 64 bits (bigint), soportando volúmenes masivos (Big Data) y cumpliendo el requisito obligatorio de SQL Server para vistas indexadas."
  },
  {
    id: 11,
    topic: "T-SQL y Ventana",
    stem: "¿Qué resultado devuelve SELECT CONCAT('Urban', ' ', NULL, 'Style') en T-SQL?",
    code: "",
    options: [
      "'Urban Style', porque CONCAT trata los valores NULL como cadenas vacías.",
      "NULL completo, porque cualquier NULL propaga nulidad en toda la expresión.",
      "Un error de compilación por tipo incompatible."
    ],
    correct: 0,
    explanation: "A diferencia del operador \"+\", CONCAT() convierte los argumentos a texto y sustituye cualquier NULL por '' automáticamente."
  },
  {
    id: 12,
    topic: "T-SQL y Ventana",
    stem: "En el trigger de auditoría, ¿por qué se escribe 'Cita Eliminada N° ' + CAST(d.ID_CITA AS VARCHAR)?",
    code: "'Cita Eliminada N° ' + CAST(d.ID_CITA AS VARCHAR) + ' del Paciente DNI: ' + d.DNI_PACIENTE",
    options: [
      "Para convertir explícitamente el entero ID_CITA a texto y evitar que \"+\" intente una suma aritmética con error de tipo.",
      "Para encriptar el identificador del paciente antes de insertarlo en la tabla de auditoría.",
      "Para cambiar permanentemente el tipo de dato de la columna ID_CITA en la tabla original."
    ],
    correct: 0,
    explanation: "En T-SQL el operador \"+\" tiene mayor precedencia aritmética cuando uno de los operandos es INT; usar CAST a VARCHAR garantiza concatenación segura."
  },
  {
    id: 13,
    topic: "T-SQL y Ventana",
    stem: "En la vista vw_Metadatos, ¿qué filas retorna sys.tables t INNER JOIN sys.schemas s ON s.schema_id = t.schema_id?",
    code: "",
    options: [
      "Solo las tablas que tienen un esquema coincidente en sys.schemas.",
      "Todos los esquemas vacíos aunque no contengan ninguna tabla.",
      "El producto cartesiano completo entre tablas y esquemas sin filtrar."
    ],
    correct: 0,
    explanation: "INNER JOIN devuelve únicamente la intersección de registros que cumplen la igualdad de claves especificada en ON."
  },
  {
    id: 14,
    topic: "T-SQL y Ventana",
    stem: "Al ejecutar SELECT c.Nombre, p.ID_Pedido FROM Cliente c LEFT JOIN Pedido p ON c.ID = p.ID_Cliente, ¿qué ocurre con los clientes sin pedidos?",
    code: "",
    options: [
      "Aparecen en el resultado con p.ID_Pedido en NULL.",
      "Se excluyen automáticamente del resultado final.",
      "Generan una excepción de integridad referencial."
    ],
    correct: 0,
    explanation: "LEFT JOIN preserva todas las filas de la tabla izquierda (Cliente) aunque no exista coincidencia en la derecha (Pedido), rellenando con NULL."
  },
  {
    id: 15,
    topic: "T-SQL y Ventana",
    stem: "¿Para qué escenario de ingeniería de datos es especialmente útil FULL OUTER JOIN?",
    code: "",
    options: [
      "Para conciliar dos conjuntos (origen vs destino ETL) identificando tanto registros faltantes en destino como huérfanos en origen.",
      "Para eliminar filas duplicadas dentro de una misma tabla sin usar DISTINCT.",
      "Para ordenar resultados jerárquicos sin usar ORDER BY."
    ],
    correct: 0,
    explanation: "FULL OUTER JOIN conserva las filas no coincidentes de ambos lados, permitiendo auditar diferencias simétricas entre fuentes."
  },
  {
    id: 16,
    topic: "T-SQL y Ventana",
    stem: "¿Qué función cumple CROSS APPLY OPENJSON(columna_json) en una consulta T-SQL?",
    code: "",
    options: [
      "Evalúa y desanida el contenido JSON de cada fila externa devolviendo sus claves o elementos como filas relacionales.",
      "Exporta automáticamente toda la base de datos SQL Server hacia una colección de MongoDB.",
      "Comprime la columna JSON en formato binario varbinary(max)."
    ],
    correct: 0,
    explanation: "CROSS APPLY invoca la función de tabla OPENJSON por cada registro, transformando datos semiestructurados JSON en columnas tipadas."
  },
  {
    id: 17,
    topic: "T-SQL y Ventana",
    stem: "¿Qué subtotales genera GROUP BY ROLLUP (Categoria, Marca)?",
    code: "",
    options: [
      "Agrupaciones por (Categoria, Marca), subtotales por cada Categoria y un gran total general.",
      "Únicamente los totales por Marca sin gran total general.",
      "Columnas horizontales rotadas para cada nombre de Marca."
    ],
    correct: 0,
    explanation: "ROLLUP calcula agregados jerárquicos reduciendo las columnas de derecha a izquierda: (Categoria, Marca) -> (Categoria) -> ()."
  },
  {
    id: 18,
    topic: "T-SQL y Ventana",
    stem: "¿Qué hace el operador PIVOT en SQL Server?",
    code: "",
    options: [
      "Convierte valores únicos de una columna en múltiples columnas de salida aplicando una función de agregación.",
      "Elimina índices fragmentados de una tabla transaccional.",
      "Cierra un cursor abierto y libera su memoria."
    ],
    correct: 0,
    explanation: "PIVOT rota filas en columnas (por ejemplo, transformar filas de meses o canales en columnas individuales con su suma de ventas)."
  },
  {
    id: 19,
    topic: "T-SQL y Ventana",
    stem: "¿Qué controla la sugerencia de consulta OPTION (MAXDOP 2)?",
    code: "",
    options: [
      "Limita a un máximo de 2 procesadores lógicos (hilos en paralelo) la ejecución de esa consulta.",
      "Limita la consulta a devolver únicamente las primeras 2 filas.",
      "Fija un tiempo de espera máximo de 2 segundos antes de hacer ROLLBACK."
    ],
    correct: 0,
    explanation: "MAXDOP (Maximum Degree of Parallelism) controla cuántos núcleos puede emplear SQL Server en paralelo para un plan de ejecución."
  },
  {
    id: 20,
    topic: "Triggers y Cursores",
    stem: "En un bucle con cursores, ¿qué indica la condición WHILE @@FETCH_STATUS = 0?",
    code: "FETCH NEXT FROM c_ResumenEspecialidad INTO @Esp, @Cant;\nWHILE @@FETCH_STATUS = 0\nBEGIN\n  ...\nEND",
    options: [
      "Que la última instrucción FETCH recuperó una fila correctamente y puede continuar iterando.",
      "Que el cursor llegó al final del conjunto de resultados y debe detenerse.",
      "Que la tabla base está vacía o bloqueada por otra transacción."
    ],
    correct: 0,
    explanation: "@@FETCH_STATUS vale 0 cuando FETCH tiene éxito; al alcanzar el final de los registros cambia a -1 y el bucle WHILE finaliza."
  },
  {
    id: 21,
    topic: "Triggers y Cursores",
    stem: "Después de terminar de recorrer un cursor en SQL Server, ¿por qué se ejecutan tanto CLOSE como DEALLOCATE?",
    code: "CLOSE c_ResumenEspecialidad;\nDEALLOCATE c_ResumenEspecialidad;",
    options: [
      "CLOSE libera el conjunto actual y sus bloqueos; DEALLOCATE libera la estructura y memoria del cursor.",
      "CLOSE guarda los cambios en disco y DEALLOCATE borra las filas de la tabla origen.",
      "Son sinónimos exactos y basta ejecutar uno solo para eliminar el objeto."
    ],
    correct: 0,
    explanation: "CLOSE permite reabrir el cursor más adelante si hiciera falta, mientras DEALLOCATE elimina por completo la definición del cursor en memoria."
  },
  {
    id: 22,
    topic: "Triggers y Cursores",
    stem: "Observando este fragmento de TRG_AUDITORIA_CITAS, ¿qué operación DML se ejecuta cuando se cumple la condición IF?",
    code: "IF EXISTS (SELECT 1 FROM inserted) AND EXISTS (SELECT 1 FROM deleted)\nBEGIN\n  INSERT INTO AUDITORIA_SISTEMA (...) SELECT ... FROM deleted d JOIN inserted i ON d.ID_CITA = i.ID_CITA;\nEND",
    options: [
      "UPDATE, porque existen tanto los valores previos (deleted) como los nuevos (inserted).",
      "INSERT, porque inserted contiene las filas recién agregadas.",
      "DELETE, porque deleted conserva las filas eliminadas."
    ],
    correct: 0,
    explanation: "Solo en un UPDATE SQL Server puebla simultáneamente deleted (estado anterior) e inserted (estado nuevo)."
  },
  {
    id: 23,
    topic: "Triggers y Cursores",
    stem: "Siguiendo la lógica de TRG_AUDITORIA_CITAS, ¿qué operación ocurre cuando NOT EXISTS (SELECT 1 FROM inserted) AND EXISTS (SELECT 1 FROM deleted)?",
    code: "",
    options: [
      "DELETE, ya que hubo filas eliminadas pero ninguna fila nueva insertada.",
      "INSERT masivo mediante BULK INSERT.",
      "UPDATE sobre columnas BIT."
    ],
    correct: 0,
    explanation: "En un DELETE solo la tabla lógica deleted contiene registros, mientras inserted permanece vacía."
  },
  {
    id: 24,
    topic: "Triggers y Cursores",
    stem: "En el mismo trigger hospitalario, ¿qué efecto produce este bloque si alguien intenta modificar una cita a las 22:00 hrs?",
    code: "IF DATEPART(HH, GETDATE()) NOT BETWEEN 8 AND 20\nBEGIN\n  ROLLBACK TRANSACTION;\n  RAISERROR('RESTRICCION: Solo entre 08:00 y 20:00 hrs.', 16, 1);\n  RETURN;\nEND",
    options: [
      "Revierte por completo la modificación o eliminación de la cita y envía el mensaje de restricción al cliente.",
      "Pospone la actualización automáticamente para las 08:00 del día siguiente.",
      "Registra la cita con estado NULL sin deshacer la transacción."
    ],
    correct: 0,
    explanation: "ROLLBACK TRANSACTION deshace la operación DML que disparó el trigger y RAISERROR con severidad 16 informa el error al usuario o aplicación."
  },
  {
    id: 25,
    topic: "Triggers y Cursores",
    stem: "Según la documentación de CREATE TRIGGER en SQL Server, ¿qué tipos de datos deben usarse en lugar de text, ntext e image en tablas inserted y deleted?",
    code: "",
    options: [
      "varchar(MAX), nvarchar(MAX) y varbinary(MAX), soportados tanto en triggers AFTER como INSTEAD OF.",
      "Únicamente char(8) y bit para evitar errores de CLR.",
      "Smallmoney y datetimeoffset."
    ],
    correct: 0,
    explanation: "Microsoft advierte que ntext, text e image serán retirados en versiones futuras y recomienda varchar(MAX), nvarchar(MAX) y varbinary(MAX), totalmente compatibles con triggers AFTER e INSTEAD OF."
  },
  {
    id: 26,
    topic: "Triggers y Cursores",
    stem: "¿Por qué los procedimientos almacenados transaccionales de ventas e inventario implementan bloques BEGIN TRY ... BEGIN CATCH?",
    code: "",
    options: [
      "Para capturar errores en tiempo de ejecución y revertir la transacción de forma segura (ROLLBACK) sin dejar stock o ventas inconsistentes.",
      "Para acelerar las consultas SELECT reemplazando la necesidad de índices.",
      "Para convertir procedimientos almacenados en vistas materializadas."
    ],
    correct: 0,
    explanation: "TRY...CATCH garantiza atomicidad: si falla la inserción del detalle o la actualización de stock, el flujo salta a CATCH y ejecuta ROLLBACK."
  },
  {
    id: 27,
    topic: "T-SQL y Ventana",
    stem: "¿Qué utilidad tiene la vista dbo.vw_Metadatos construida con sys.tables, sys.schemas, sys.columns y sys.types?",
    code: "",
    options: [
      "Generar dinámicamente un diccionario de datos actualizado con esquemas, tablas, columnas, tipos, longitud y nulabilidad.",
      "Ejecutar paquetes de Spark directamente dentro del motor de SQL Server Express.",
      "Almacenar contraseñas encriptadas de los usuarios finales."
    ],
    correct: 0,
    explanation: "Consultar las vistas de catálogo del sistema permite auditar la estructura real de la base de datos y alimentar diccionarios de datos sin mantener documentación manual desfasada."
  },
  {
    id: 28,
    topic: "Big Data y BI",
    stem: "De acuerdo con el informe de arquitectura en SQL Server Express, ¿qué limitación obliga a usar el Programador de tareas de Windows para automatizar el ETL?",
    code: "",
    options: [
      "SQL Server Express no incluye SQL Server Agent (ni Analysis Services) y limita cada base a 10 GB.",
      "SQL Server Express prohíbe crear procedimientos almacenados y funciones UDF.",
      "SQL Server Express solo funciona en sistemas operativos sin interfaz de red."
    ],
    correct: 0,
    explanation: "La edición Express carece de SQL Server Agent para programar jobs internos; por ello, las cargas ETL periódicas se automatizan externamente con el Programador de tareas de Windows."
  },
  {
    id: 29,
    topic: "Big Data y BI",
    stem: "En el caso ETL de LearnData (WooCommerce y Stripe en CSV), ¿qué tareas corresponden a la fase de Transformación?",
    code: "",
    options: [
      "Homogeneizar formatos, limpiar espacios/nulos, validar tipos y relacionar pedidos por SKU y número de pedido antes de cargar el Data Mart.",
      "Instalar el plugin de WooCommerce en WordPress para recibir pagos con tarjeta.",
      "Eliminar todas las llaves primarias del modelo relacional."
    ],
    correct: 0,
    explanation: "La fase Transformación depura e integra los datos extraídos de fuentes heterogéneas (WooCommerce y Stripe) para que sean consistentes en el modelo analítico."
  },
  {
    id: 30,
    topic: "Big Data y BI",
    stem: "En un modelo dimensional en Estrella (metodología Kimball), ¿qué distingue a FactVentas de DimCliente?",
    code: "",
    options: [
      "FactVentas guarda métricas cuantitativas de eventos (cantidad, monto) y claves foráneas; DimCliente contiene atributos descriptivos para filtrar y agrupar.",
      "DimCliente guarda únicamente sumas de ventas diarias sin texto descriptivo.",
      "FactVentas no puede conectarse mediante llaves foráneas a ninguna dimensión."
    ],
    correct: 0,
    explanation: "En el esquema estrella, la tabla de hechos concentra las medidas numéricas y llaves de cruce, mientras las dimensiones aportan el contexto de negocio (quién, qué, cuándo, dónde)."
  },
  {
    id: 31,
    topic: "Big Data y BI",
    stem: "En las bases de datos NoSQL orientadas a documentos (como MongoDB), ¿qué significa que los documentos sean \"sin esquema\" (schemaless)?",
    code: "",
    options: [
      "Cada documento puede tener distinta cantidad y variedad de campos sin exigir una estructura de columnas fija ni celdas vacías.",
      "No permiten realizar consultas ni crear índices sobre los campos.",
      "Solo pueden almacenar archivos binarios sin pares campo-valor."
    ],
    correct: 0,
    explanation: "Los documentos flexibles facilitan la evolución ágil de aplicaciones con datos polimórficos o semiestructurados sin alterar tablas rígidas."
  },
  {
    id: 32,
    topic: "Big Data y BI",
    stem: "Según el tutorial de MongoDB, ¿en qué se diferencia un índice parcial de un índice disperso (sparse)?",
    code: "",
    options: [
      "El disperso solo verifica la existencia del campo indexado; el parcial evalúa un filtro con condiciones específicas incluso sobre otros campos.",
      "El disperso solo funciona en SQL Server y el parcial exclusivamente en Stripe.",
      "El índice parcial duplica toda la colección en memoria RAM automáticamente."
    ],
    correct: 0,
    explanation: "Un índice parcial usa partialFilterExpression para seleccionar documentos bajo reglas complejas (por ejemplo {activo: true}), superando en flexibilidad a un índice disperso."
  }
];
