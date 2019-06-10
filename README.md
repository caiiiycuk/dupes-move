# mdupes

Move files in "Trash" directory based on fdupes / jdupes output

## Usage

```
fdupes -r . > duplicates.fdupes
mdupes duplicates.fdupes directory-to-store-moved-files
```

Instead of `fdupes` you can use also `jdupes`

**NOTE**: By default this program never modify or move your files, it's only generates
sequency of mv commands for moving files. For actual moving you should use -m flag

```
fdupes -r . > duplicates.fdupes
mdupes duplicates.fdupes directory-to-store-moved-files -m
```

## Building

```
npm install
./node_modules/typescript/bin/tsc
```

mdupes is located in `build/mdupes.js`
