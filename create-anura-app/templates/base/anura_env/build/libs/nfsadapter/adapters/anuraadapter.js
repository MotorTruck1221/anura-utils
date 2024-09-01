import { errors } from '../util.js'

import config from '../config.js'
const join = window.Filer.path.join;
const fs = window.anura.fs.promises;
const Buffer = window.Filer.Buffer;
const cbfs = window.anura.fs; // This stands for callback fs but I like to pretend it stands for cock and ball fs.

const {
  DOMException
} = config

const { INVALID, GONE, MISMATCH, MOD_ERR, SYNTAX } = errors

/**
 * @see https://github.com/node-fetch/fetch-blob/blob/0455796ede330ecffd9eb6b9fdf206cc15f90f3e/index.js#L232
 * @param {*} object
 * @returns {object is Blob}
 */
function isBlob (object) {
  return (
    object &&
    typeof object === 'object' &&
    typeof object.constructor === 'function' &&
    (
      typeof object.stream === 'function' ||
      typeof object.arrayBuffer === 'function'
    ) &&
    /^(Blob|File)$/.test(object[Symbol.toStringTag])
  )
}

export class Sink {
  /**
   * @param {fs.FileHandle} fileHandle
   * @param {number} size
   */
  constructor (fileHandle, size) {
    this._fileHandle = fileHandle
    this._size = size
    this._position = 0
  }

  async abort() {
    const filehandle = this._fileHandle
    await new Promise((res, rej) => {
      cbfs.close(filehandle, (err) => {
        if (!err) res() 
          else rej()
      })
    })
  }

  async write (chunk) {
    if (typeof chunk === 'object') {
      if (chunk.type === 'write') {
        if (Number.isInteger(chunk.position) && chunk.position >= 0) {
          this._position = chunk.position
        }
        if (!('data' in chunk)) {
          const filehandle = this._fileHandle
          await new Promise((res, rej) => {
            cbfs.close(filehandle, (err) => {
              if (!err) res() 
                else rej()
            })
          })
          throw new DOMException(...SYNTAX('write requires a data argument'))
        }
        chunk = chunk.data
      } else if (chunk.type === 'seek') {
        if (Number.isInteger(chunk.position) && chunk.position >= 0) {
          if (this._size < chunk.position) {
            throw new DOMException(...INVALID)
          }
          this._position = chunk.position
          return
        } else {
          const filehandle = this._fileHandle
          await new Promise((res, rej) => {
            cbfs.close(filehandle, (err) => {
              if (!err) res() 
                else rej()
            })
          })
          throw new DOMException(...SYNTAX('seek requires a position argument'))
        }
      } else if (chunk.type === 'truncate') {
        if (Number.isInteger(chunk.size) && chunk.size >= 0) {
          console.log("handle:")
          console.log(this._fileHandle)
          const filehandle = this._fileHandle
          await new Promise((res, rej) => {
            cbfs.ftruncate(filehandle, chunk.size, (err) => {
              if (!err) res() 
                else rej()
            })
          })
          this._size = chunk.size
          if (this._position > this._size) {
            this._position = this._size
          }
          return
        } else {
          const filehandle = this._fileHandle
          await new Promise((res, rej) => {
            cbfs.close(filehandle, (err) => {
              if (!err) res() 
                else rej()
            })
          })
          throw new DOMException(...SYNTAX('truncate requires a size argument'))
        }
      }
    }

    if (chunk instanceof ArrayBuffer) {
      chunk = new Uint8Array(chunk)
    } else if (typeof chunk === 'string') {
      chunk = Buffer.from(chunk)
    } else if (isBlob(chunk)) {
      for await (const data of chunk.stream()) {
        // const res = await this._fileHandle.writev([data], this._position)
        const res = await new Promise((res, rej) => { 
          cbfs.write(this._fileHandle, Filer.Buffer.from(data), 0, data.length, this._position, (err, nbytes) => {
            if (err) rej(err)
              else res(nbytes);
        })})
        this._position += res.bytesWritten
        this._size += res.bytesWritten
      }
      return
    }
    
    const res = await new Promise((res, rej) => { 
      cbfs.write(this._fileHandle, Filer.Buffer.from(chunk), 0, chunk.length, this._position, (err, nbytes) => {
        if (err) rej(err)
          else res(nbytes);
    })})
    // const res = await this._fileHandle.writev([chunk], this._position)
    this._position += res.bytesWritten
    this._size += res.bytesWritten
  }

  async close () {
    // First make sure we close the handle
    const filehandle = this._fileHandle
    await new Promise((res, rej) => {
      cbfs.close(filehandle, (err) => {
        if (!err) res() 
          else rej()
      })
    })
  }
}

export class FileHandle {

  /**
   * @param {string} path
   * @param {string} name
   */
  constructor (path, name) {
    this._path = path
    this.name = name
    this.kind = 'file'
  }

  async getFile () {
    await fs.stat(this._path).catch(err => {
      if (err.code === 'ENOENT') throw new DOMException(...GONE)
    })

    // TODO: replace once https://github.com/nodejs/node/issues/37340 is fixed
    return new File([await fs.readFile(this._path)], this.name);
  }

  async isSameEntry (other) {
    return this._path === this._getPath.apply(other)
  }

  _getPath() {
    return this._path
  }

  /** @param {{ keepExistingData: boolean; }} opts */
  async createWritable (opts) {
    const fileHandle = await fs.open(this._path, opts.keepExistingData ? 'r+' : 'w+').catch(err => {
      if (err.code === 'ENOENT') throw new DOMException(...GONE)
      throw err
    })
    const { size } = await fs.stat(this._path);
    return new Sink(fileHandle, size)
  }
}

export class FolderHandle {
  _path = ''

  constructor (path = '', name = '') {
    this.name = name
    this.kind = 'directory'
    this._path = path
  }

  /** @param {FolderHandle} other */
  async isSameEntry (other) {
    return this._path === other._path
  }

  /** @returns {AsyncGenerator<[string, FileHandle | FolderHandle]>} */
  async * entries () {
    const dir = this._path
    const items = await fs.readdir(dir).catch(err => {
      if (err.code === 'ENOENT') throw new DOMException(...GONE)
      throw err
    })
    for (let name of items) {
      const path = Filer.path.join(dir, name)

      const stat = await fs.lstat(path)
      if (stat.isFile()) {
        yield [name, new FileHandle(path, name)]
      } else if (stat.isDirectory()) {
        yield [name, new FolderHandle(path, name)]
      }
    }
  }

  /**
   * @param {string} name
   * @param {{ create: boolean; }} opts
   */
  async getDirectoryHandle (name, opts) {
    const path = join(this._path, name)
    const stat = await fs.lstat(path).catch(err => {
      if (err.code !== 'ENOENT') throw err
    })
    const isDirectory = stat?.isDirectory()
    if (stat && isDirectory) return new FolderHandle(path, name)
    if (stat && !isDirectory) throw new DOMException(...MISMATCH)
    if (!opts.create) throw new DOMException(...GONE)
    await fs.mkdir(path)
    return new FolderHandle(path, name)
  }

  /**
   * @param {string} name
   * @param {{ create: boolean; }} opts
   */
  async getFileHandle (name, opts) {
    const path = join(this._path, name)
    const stat = await fs.lstat(path).catch(err => {
      if (err.code !== 'ENOENT') throw err
    })
    const isFile = stat?.isFile()
    if (stat && isFile) return new FileHandle(path, name)
    if (stat && !isFile) throw new DOMException(...MISMATCH)
    if (!opts.create) throw new DOMException(...GONE)
    anura.fs.close(await fs.open(path, 'w'))
    return new FileHandle(path, name)
  }

  async queryPermission () {
    return 'granted'
  } 

  /**
   * @param {string} name
   * @param {{ recursive: boolean; }} opts
   */
  async removeEntry (name, opts) {
    const path = join(this._path, name)
    const stat = await fs.lstat(path).catch(err => {
      if (err.code === 'ENOENT') throw new DOMException(...GONE)
      throw err
    })
    if (stat.isDirectory()) {
      if (opts.recursive) {
        await fs.rm(path, { recursive: true, }).catch(err => {
          if (err.code === 'ENOTEMPTY') throw new DOMException(...MOD_ERR)
          throw err
        })
      } else {
        await fs.rmdir(path).catch(err => {
          if (err.code === 'ENOTEMPTY') throw new DOMException(...MOD_ERR)
          throw err
        })
      }
    } else {
      await fs.unlink(path)
    }
  }
}

export default path => {
  return new FolderHandle("/")

}
