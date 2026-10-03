# LMP Autos · juego v0.46 · 100 vehículos nuevos

Actualización incremental para una instalación del juego v0.45.

## Instalación

1. Hacé una copia de tu carpeta actual del juego. Podés exportar también la partida desde el menú del juego.
2. Extraé este ZIP y copiá la carpeta `juego` sobre la carpeta `juego` existente. Aceptá reemplazar `juego/index.html`, `juego/partida.js` y `juego/data/autos.json`; los otros archivos son 100 imágenes nuevas.
3. Conservá todos los archivos de v0.45, incluidas las imágenes 1–130, `data/eventos.json`, los scripts de guardado y de logros y sus estilos. Este ZIP agrega y reemplaza archivos; no requiere borrar ninguno.
4. En un hosting, subí los archivos con las mismas rutas relativas. Recargá la página con Ctrl+F5. Usá el mismo dominio, ruta y perfil del navegador para seguir accediendo a tus datos locales.

## Cambios

- Catálogo de 230 vehículos: los 130 anteriores intactos y 100 altas del Excel aprobado.
- 40 modelos de Rolls-Royce, Ferrari, Lamborghini, Mercedes-Benz y Porsche, y 60 variantes por año de modelos usados en Argentina.
- Nombres limpios: el juego presenta el año por separado. Cada alta conserva el ID y el nombre de archivo del Excel, con prefijos 131–230.
- 100 imágenes PNG de 500 × 500, con el vehículo completo y centrado, su nombre y sin números sobre la imagen. Se mantiene la numeración del archivo porque forma parte de la integración.
- Las variantes por año conservan características y eventos de su modelo base. Los eventos exclusivos siguen contando una vez por modelo base en cada trayectoria.
- Las nuevas imágenes cargan directamente como PNG; las imágenes anteriores mantienen su sistema de extensiones.
- Partidas y logros siguen usando las mismas claves de guardado local. No se reinicia ni migra el almacenamiento.
- Las altas representan un año concreto: 0 km durante ese año, usadas después, y nunca disponibles antes de su año.

## Datos y límites

Los valores en USD corresponden al balance propuesto del juego, no a cotizaciones de mercado. Los índices y gastos de las 40 altas de lujo se adaptaron a la escala existente; las 60 variantes heredan los de su modelo base. El color principal corresponde a la imagen; los colores alternativos quedan como datos de referencia, sin agregar un taller de pintura.

Las imágenes son representaciones generadas con IA. Se revisaron encuadre y correspondencia general, pero no se certifica cada detalle de equipamiento por año. El Excel conserva su formato y sus IDs originales; no se modificó.

## Vehículos agregados

| Nº archivo | Nombre | Año | Color | Valor base USD |
| --- | --- | --- | --- | --- |
| 131 | Rolls-Royce Silver Cloud III | 1962 | Negro | 42,000 |
| 132 | Rolls-Royce Silver Shadow | 1965 | Plata | 30,000 |
| 133 | Rolls-Royce Corniche Convertible | 1971 | Bordó | 52,000 |
| 134 | Rolls-Royce Silver Spirit | 1980 | Azul oscuro | 34,000 |
| 135 | Rolls-Royce Ghost I | 2010 | Crema | 98,000 |
| 136 | Rolls-Royce Wraith | 2013 | Blanco | 125,000 |
| 137 | Rolls-Royce Dawn | 2016 | Negro | 135,000 |
| 138 | Rolls-Royce Cullinan | 2018 | Plata | 150,000 |
| 139 | Ferrari 308 GTB | 1975 | Rojo | 48,000 |
| 140 | Ferrari Testarossa | 1984 | Amarillo | 78,000 |
| 141 | Ferrari 348 TB | 1989 | Negro | 62,000 |
| 142 | Ferrari F355 Berlinetta | 1994 | Blanco | 74,000 |
| 143 | Ferrari 360 Modena | 1999 | Azul | 86,000 |
| 144 | Ferrari F430 | 2004 | Rojo | 98,000 |
| 145 | Ferrari 458 Italia | 2009 | Amarillo | 115,000 |
| 146 | Ferrari 488 GTB | 2015 | Negro | 132,000 |
| 147 | Lamborghini Miura P400 | 1966 | Amarillo | 92,000 |
| 148 | Lamborghini Countach LP400 | 1974 | Naranja | 105,000 |
| 149 | Lamborghini Diablo VT | 1993 | Verde | 96,000 |
| 150 | Lamborghini Murciélago | 2001 | Negro | 108,000 |
| 151 | Lamborghini Gallardo | 2003 | Blanco | 79,000 |
| 152 | Lamborghini Aventador LP700-4 | 2011 | Rojo | 142,000 |
| 153 | Lamborghini Huracán LP610-4 | 2014 | Amarillo | 115,000 |
| 154 | Lamborghini Urus | 2018 | Naranja | 128,000 |
| 155 | Mercedes-Benz 280 SE W108 | 1968 | Plata | 18,000 |
| 156 | Mercedes-Benz 350 SL R107 | 1971 | Negro | 27,000 |
| 157 | Mercedes-Benz 230 E W123 | 1980 | Azul oscuro | 14,000 |
| 158 | Mercedes-Benz 500 SEC C126 | 1981 | Bordó | 31,000 |
| 159 | Mercedes-Benz C180 W202 | 1993 | Blanco | 15,000 |
| 160 | Mercedes-Benz G320 W463 | 1994 | Plata | 32,000 |
| 161 | Mercedes-Benz SLK 230 Kompressor R170 | 2000 | Negro | 22,000 |
| 162 | Mercedes-Benz AMG GT Coupé | 2015 | Azul oscuro | 86,000 |
| 163 | Porsche 356 B | 1960 | Rojo | 52,000 |
| 164 | Porsche 911 Turbo 930 | 1975 | Plata | 76,000 |
| 165 | Porsche 928 | 1978 | Amarillo | 32,000 |
| 166 | Porsche 944 | 1982 | Blanco | 23,000 |
| 167 | Porsche Boxster 986 | 1997 | Azul oscuro | 28,000 |
| 168 | Porsche 911 Carrera 996 | 1998 | Rojo | 39,000 |
| 169 | Porsche Cayenne 955 | 2003 | Plata | 35,000 |
| 170 | Porsche Cayman 987 | 2006 | Amarillo | 41,000 |
| 171 | Fiat 147 | 1983 | Bordó | 2,400 |
| 172 | Fiat 147 | 1986 | Beige | 2,500 |
| 173 | Fiat 147 | 1989 | Blanco | 2,700 |
| 174 | Fiat 147 | 1992 | Rojo | 2,800 |
| 175 | Fiat 147 | 1995 | Azul | 3,000 |
| 176 | Fiat 147 | 1997 | Gris plata | 3,100 |
| 177 | Fiat Duna | 1988 | Bordó | 3,000 |
| 178 | Fiat Duna | 1991 | Beige | 3,300 |
| 179 | Fiat Duna | 1994 | Blanco | 3,500 |
| 180 | Fiat Duna | 1997 | Rojo | 3,800 |
| 181 | Fiat Duna | 2000 | Azul | 4,100 |
| 182 | Volkswagen Gol G1 | 1992 | Gris plata | 4,300 |
| 183 | Volkswagen Gol G1 | 1994 | Bordó | 4,600 |
| 184 | Volkswagen Gol G2 | 1997 | Beige | 4,900 |
| 185 | Volkswagen Gol G2 | 2001 | Blanco | 5,500 |
| 186 | Volkswagen Gol Power | 2006 | Rojo | 6,200 |
| 187 | Volkswagen Gol Trend | 2012 | Azul | 8,900 |
| 188 | Fiat Uno | 1991 | Gris plata | 3,400 |
| 189 | Fiat Uno | 1995 | Bordó | 3,700 |
| 190 | Fiat Uno | 2000 | Beige | 4,100 |
| 191 | Fiat Uno | 2006 | Blanco | 4,500 |
| 192 | Fiat Uno | 2012 | Rojo | 4,900 |
| 193 | Peugeot 504 | 1971 | Azul | 4,200 |
| 194 | Peugeot 504 | 1977 | Gris plata | 4,500 |
| 195 | Peugeot 504 | 1983 | Bordó | 4,700 |
| 196 | Peugeot 504 | 1990 | Beige | 5,100 |
| 197 | Peugeot 504 | 1997 | Blanco | 5,400 |
| 198 | Peugeot 505 | 1982 | Rojo | 5,300 |
| 199 | Peugeot 505 | 1986 | Azul | 5,800 |
| 200 | Peugeot 505 | 1990 | Gris plata | 6,400 |
| 201 | Peugeot 505 | 1994 | Bordó | 6,800 |
| 202 | Peugeot 206 | 2000 | Beige | 6,200 |
| 203 | Peugeot 206 | 2003 | Blanco | 6,700 |
| 204 | Peugeot 206 | 2006 | Rojo | 7,200 |
| 205 | Peugeot 206 | 2009 | Azul | 7,800 |
| 206 | Peugeot 206 | 2012 | Gris plata | 8,300 |
| 207 | Renault 12 | 1975 | Bordó | 3,700 |
| 208 | Renault 12 | 1982 | Beige | 4,100 |
| 209 | Renault 12 | 1992 | Blanco | 4,700 |
| 210 | Renault 9 | 1989 | Rojo | 3,800 |
| 211 | Renault 9 | 1996 | Azul | 4,500 |
| 212 | Renault Clio I | 1995 | Gris plata | 5,000 |
| 213 | Renault Clio II | 2004 | Bordó | 6,200 |
| 214 | Renault Clio II | 2012 | Beige | 7,200 |
| 215 | Ford Falcon | 1970 | Blanco | 3,700 |
| 216 | Ford Falcon | 1982 | Rojo | 4,100 |
| 217 | Ford Falcon | 1990 | Azul | 4,500 |
| 218 | Ford Escort | 1990 | Gris plata | 4,200 |
| 219 | Ford Escort | 1997 | Bordó | 4,700 |
| 220 | Ford Escort | 2003 | Beige | 5,400 |
| 221 | Chevrolet Corsa | 1997 | Blanco | 4,200 |
| 222 | Chevrolet Corsa | 2005 | Rojo | 4,900 |
| 223 | Chevrolet Corsa | 2012 | Azul | 5,500 |
| 224 | Fiat Palio | 1999 | Gris plata | 5,000 |
| 225 | Fiat Palio | 2008 | Bordó | 5,800 |
| 226 | Fiat Siena | 2001 | Beige | 5,400 |
| 227 | Fiat Siena | 2010 | Blanco | 6,300 |
| 228 | Toyota Corolla E110 | 2000 | Rojo | 8,500 |
| 229 | Toyota Corolla E120 | 2006 | Azul | 11,300 |
| 230 | Toyota Corolla E140 | 2012 | Gris plata | 13,200 |


## Verificaciones realizadas

- Correspondencia de las 100 altas con los IDs, archivos, años y precios del Excel.
- 100 PNG válidos de 500 × 500 y sin alterar las imágenes ya revisadas.
- Compras, guardado en garaje y reactivación de los 100 vehículos nuevos.
- Disponibilidad por año, precios finitos y 60 variantes con eventos de su modelo base.
- Continuidad de partidas anteriores y de logros, incluidas las 8 Ferrari nuevas.
- 20 pruebas de regresión y 120 trayectorias completas sin errores.
- Prueba en navegador: Fiat 147 de 1992, nombre y año separados, imagen 500 × 500, evento del modelo base y recarga conservando la partida.
- ZIP validado por CRC, contenido y coincidencia con la versión preparada.
