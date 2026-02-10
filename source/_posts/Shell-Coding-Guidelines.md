---
title: Shell Coding Guidelines
date: 2025-09-28
categories:
- [Reference]
---

## Removing Suffix by Separator

Want to strip off everything after the **first or last occurrence** of a separator in a string? Suppose your string is `$string` and the separator is `$separator`:

Before the **first** occurrence:

```sh
result="${string%%"$separator"*}"
```

Before the **last** occurrence:

```sh
result="${string%"$separator"*}"
```

Example:

```sh
string='abc-def-ghi'
separator='-'

echo "${string%%"$separator"*}"  # Outputs: abc
echo "${string%"$separator"*}"   # Outputs: abc-def
```

## Appending Content to a Command Pipeline

Suppose you have a file and want to process its contents, then append more data before passing it all to the next part of a pipeline. The most robust, portable (POSIX-compliant) solution is:

```sh
{ cat file.txt; echo 'additional content'; } | your_next_command
```

Why this works:

- `{ ...; }` groups commands together in the current shell.
- The pipe (`|`) passes their combined output.
- This does not create unnecessary subshells and works in all POSIX shells.

**Syntax tip:** A space is required after `{` and the last command must end in a semicolon (`;`) before the closing `}`.

## Safely Using `find` + `xargs` with Filenames

Using `find` + `xargs` with filenames can break when filenames have spaces or special characters. To handle this safely, use null (`\0`) terminators:

```sh
find mydir -name '*.txt' -print0 | xargs -0 rm
```

- `-print0` makes `find` use a null character at the end of each filename.
- `-0` tells `xargs` to expect null-delimited input.

This combination ensures even weird filenames (with spaces, newlines, quotes, etc.) are handled safely.

## Running Commands Concurrently with GNU Parallel

When you need to run multiple jobs in parallel, **GNU Parallel** is a powerful alternative to writing manual process control code in Bash. Some of its key features:

- **Runs jobs concurrently**: Starts as many jobs as the number of cores (configurable).
- **Waits for all jobs to finish**: The `parallel` process only exits once all child jobs complete.
- **Automatic signal propagation**: If you press `Ctrl+C` or send `SIGTERM` to `parallel`, it automatically sends the same signal to all running subjobs.

**Basic usage:**

```bash
parallel ::: command-1 command-2 command-3
```

### Output Handling

By default, `parallel` **buffers** the output of each job; only after a job finishes is its full output printed. This prevents interleaving.

- To output each job's data ***immediately*** (allowing interleaved output from competing jobs), use the `--ungroup` option (applies separately to stdout and stderr):

    ```bash
    parallel --ungroup --ungroup ::: command-1 command-2 command-3
    ```

### Controlling Concurrency and Failure

- **Limit parallelism (to 2 jobs):**
    ```bash
    parallel -j 2 ::: command-1 command-2 command-3
    ```

- **Fail immediately if any job fails:**
    ```bash
    parallel --halt soon,fail=1 ::: command-1 command-2 command-3
    ```

### Running Full Shell Commands

To run arbitrary shell code (pipes, loops, redirections, etc.), use the `bash -c` idiom:

```bash
parallel bash -c ::: \
"long command 1 with args and pipes" \
"another-long-command | with-pipes" \
"for f in *.txt; do echo \$f; done"
```

### Parameterized Commands

If you have a list of input files and want to repeat the same command on each:

```bash
ls *.biginput | parallel 'long-processing-step --input {} --output {}.out'
```
Here `parallel` replaces `{}` with the filename sent through the pipeline.

## Batch Killing Processes

Sometimes we acidentally spawn a series of processes, and we want to kill them. We can look up their pid's through `ps -aux | grep <process_name>` (as shown below) and manually run the `kill` command to kill each process by providing its pid, but *how can we automate this tedious task*?

```sh
$ ps aux | grep pipreqs
jifengwu   58180  0.0  0.1  46440 27332 pts/0    T    13:38   0:00 /home/jifengwu/miniconda3/envs/dataset_investigation/bin/python /home/jifengwu/miniconda3/envs/dataset_investigation/bin/pipreqs repos/spectria/tildes/tildes --mode no-pin
jifengwu   58205  0.1  0.1  48140 29392 pts/0    T    13:38   0:00 /home/jifengwu/miniconda3/envs/dataset_investigation/bin/python /home/jifengwu/miniconda3/envs/dataset_investigation/bin/pipreqs repos/PnX-SI/GeoNature --mode no-pin
jifengwu   58224  5.7  0.2  51856 33108 pts/0    T    13:38   0:23 /home/jifengwu/miniconda3/envs/dataset_investigation/bin/python /home/jifengwu/miniconda3/envs/dataset_investigation/bin/pipreqs repos/fabiandevia/home --mode no-pin
jifengwu   58267  4.4  0.2  57880 38204 pts/0    T    13:39   0:17 /home/jifengwu/miniconda3/envs/dataset_investigation/bin/python /home/jifengwu/miniconda3/envs/dataset_investigation/bin/pipreqs repos/377312117/gitproject --mode no-pin
jifengwu   58272  2.3  0.2  53756 34252 pts/0    T    13:39   0:08 /home/jifengwu/miniconda3/envs/dataset_investigation/bin/python /home/jifengwu/miniconda3/envs/dataset_investigation/bin/pipreqs repos/crazyfish1111/home --mode no-pin
jifengwu   58282  0.1  0.1  47840 28132 pts/0    T    13:39   0:00 /home/jifengwu/miniconda3/envs/dataset_investigation/bin/python /home/jifengwu/miniconda3/envs/dataset_investigation/bin/pipreqs repos/Piratenpartei/ekklesia-portal --mode no-pin
jifengwu   58295  0.1  0.1  48220 28492 pts/0    T    13:39   0:00 /home/jifengwu/miniconda3/envs/dataset_investigation/bin/python /home/jifengwu/miniconda3/envs/dataset_investigation/bin/pipreqs repos/jauhararifin/ugrade/server --mode no-pin
jifengwu   58659  0.3  0.1  48608 29324 pts/0    T    13:41   0:00 /home/jifengwu/miniconda3/envs/dataset_investigation/bin/python /home/jifengwu/miniconda3/envs/dataset_investigation/bin/pipreqs repos/klen/pylama --mode no-pin
jifengwu   59564  0.0  0.0  19612  2516 pts/2    S+   13:45   0:00 grep --color=auto pipreqs
```

First, we can add `grep -v grep` to the pipe to *hide the grep processes from the output*:

```sh
$ ps aux | grep pipreqs | grep -v grep
jifengwu   58180  0.0  0.1  46440 27332 pts/0    T    13:38   0:00 /home/jifengwu/miniconda3/envs/dataset_investigation/bin/python /home/jifengwu/miniconda3/envs/dataset_investigation/bin/pipreqs repos/spectria/tildes/tildes --mode no-pin
jifengwu   58205  0.1  0.1  48140 29392 pts/0    T    13:38   0:00 /home/jifengwu/miniconda3/envs/dataset_investigation/bin/python /home/jifengwu/miniconda3/envs/dataset_investigation/bin/pipreqs repos/PnX-SI/GeoNature --mode no-pin
jifengwu   58224  5.6  0.2  51856 33108 pts/0    T    13:38   0:23 /home/jifengwu/miniconda3/envs/dataset_investigation/bin/python /home/jifengwu/miniconda3/envs/dataset_investigation/bin/pipreqs repos/fabiandevia/home --mode no-pin
jifengwu   58267  4.4  0.2  57880 38204 pts/0    T    13:39   0:17 /home/jifengwu/miniconda3/envs/dataset_investigation/bin/python /home/jifengwu/miniconda3/envs/dataset_investigation/bin/pipreqs repos/377312117/gitproject --mode no-pin
jifengwu   58272  2.2  0.2  53756 34252 pts/0    T    13:39   0:08 /home/jifengwu/miniconda3/envs/dataset_investigation/bin/python /home/jifengwu/miniconda3/envs/dataset_investigation/bin/pipreqs repos/crazyfish1111/home --mode no-pin
jifengwu   58282  0.1  0.1  47840 28132 pts/0    T    13:39   0:00 /home/jifengwu/miniconda3/envs/dataset_investigation/bin/python /home/jifengwu/miniconda3/envs/dataset_investigation/bin/pipreqs repos/Piratenpartei/ekklesia-portal --mode no-pin
jifengwu   58295  0.1  0.1  48220 28492 pts/0    T    13:39   0:00 /home/jifengwu/miniconda3/envs/dataset_investigation/bin/python /home/jifengwu/miniconda3/envs/dataset_investigation/bin/pipreqs repos/jauhararifin/ugrade/server --mode no-pin
jifengwu   58659  0.3  0.1  48608 29324 pts/0    T    13:41   0:00 /home/jifengwu/miniconda3/envs/dataset_investigation/bin/python /home/jifengwu/miniconda3/envs/dataset_investigation/bin/pipreqs repos/klen/pylama --mode no-pin
```

Then, we can add `awk '{print $2}'` to the pipe to invoke `awk` to *trim the second space-delimited component* (which in this case is the pid). Now we have a list of the pid's of the processes we want to kill:

```sh
$ ps aux | grep pipreqs | grep -v grep | awk '{print $2}'
58180
58205
58224
58267
58272
58282
58295
58659
```

Finally, we can iterate over the pid's in a for-loop to kill them.

```sh
for pid in $(ps aux | grep pipreqs | grep -v grep | awk '{print $2}')
do
    kill -15 $pid
done
```

## Copying Files via `cat` and `dd`

`cat` and `dd` are standard Unix utilities for handling file data.  

- `cat` outputs the contents of a file to `stdout`.
- `dd` reads `stdin` (if no `if=`) and writes to `stdout` or a file.

To copy a file, you can use a Unix pipe (`|`) to send `cat`'s output to `dd`, then write to a destination file:

```sh
cat sourcefile | dd of=destinationfile
```

### Potential Advantages of `cat` and `dd` Over `cp`

#### **Better progress/statistics**

- `dd` with the `status=progress` (GNU dd) option shows live copy statistics:
  ```
  cat bigfile | dd of=outfile status=progress
  ```

#### **Working Around `cp` Limitations**

- Some device files, file descriptors, or pseudo-files (like `/proc` or `/sys`) do not support `cp`, but streaming with `cat` + `dd` may work.


## Parsing Command-line Options

`getopts` is a built-in Unix shell command for parsing command-line options. It is a wrapper around `getopt`, a POSIX C library function used to parse command-line options of the Unix/POSIX style. Specifically:

- Options are *single-character alphanumerics* preceded by a - (hyphen-minus) character, i.e. `-a`. `-b`, `-c`.
- Options can take an argument or none.
- Multiple options can be chained together, as long as the non-last ones are not argument-taking. If `-a` and `-b` take no arguments while `-c` takes an argument, `-abc foo` is the same as `-a -c -e foo`, but `-bca` is not the same as `-b -c a` due to the preceding rule.
- When an option takes an argument, this can be in the same token or in the next one. In other words, if `-c` takes an argument, `-cfoo` is the same as `-c foo`.

### `optstring`'s

Both getopt and getopts specifies specify options using a *optstring*. Specifically:

- *Begin an optstring with `:`.*
- To specify an option that *does not take an argument*, append its name to the optstring.
- To specify an option that *takes an argument*, append its name *and `:`* to the optstring.

For example, the optstring that specifies two options `-a`, `-b` that do not take arguments and two options `-c`, `-d` that take arguments is `:abc:d:`.

### Using `getopts` in a Shell Script

In Shell scripts, `getopts` invoked with an `optstring` is used with a `while`-loop to parse command-line options.

Say that our Shell script `test_getopts.sh` accepts two options `-a`, `-b` that do not take arguments and two options `-c`, `-d` that take arguments. Our Shell script can look like this:

```sh
#!/bin/sh

while getopts ':abc:d:' name
do
    case $name in
        a)
            echo "You provided option -a"
            ;;
        b)
            echo "You provided option -b"
            ;;
        c)
            echo "You provided option -c with argument $OPTARG"
            ;;
        d)
            echo "You provided option -d with argument $OPTARG"
            ;;
        :)
            echo "Option -$OPTARG requires an argument"
            ;;
        ?)
            echo "You provided an invalid option -$OPTARG"
            ;;
    esac
done
```

Here, `getopts` is invoked with the `optstring` for specifying our options, `:abc:d:`. In each iteration of the `while`-loop, the *next option* is parsed and the Shell variables `name` and `OPTARG` are set to different values based on different conditions we may encounter.

- If a *valid* option is detected and that option *does not take an argument*, the Shell variable `name` is set to the name of the option.
- If a *valid* option is detected and that option *takes an argument*:
  - If we have provided an argument, the Shell variable `name` is set to the name of the option, and the Shell variable `OPTARG` is set to the value of the argument.
  - If we *haven't provided an argument*, *the Shell variable `name` is set to `:`, and the Shell variable `OPTARG` is set to the name of the argument*.
- If an *invalid* option is detected, *the Shell variable `name` is set to `?`, and the Shell variable `OPTARG` is set to the name of the argument*.

We can see `getopts` at work by providing different command-line options when invoking our Shell script.

Providing no command-line options:

```sh
$ sh test_getopts.sh
```

Providing option `-a` that do not take arguments:

```sh
$ sh test_getopts.sh -a
You provided option -a
```

Providing option `-a` that do not take arguments *twice*:

```sh
$ sh test_getopts.sh -a -a
You provided option -a
You provided option -a
$ sh test_getopts.sh -aa
You provided option -a
You provided option -a
```

Providing option `-c` that takes an argument with an argument `foo`:

```sh
$ sh test_getopts.sh -c foo
You provided option -c with argument foo
```

Providing option `-c` that takes an argument with an argument `foo` *twice*:

```sh
$ sh test_getopts.sh -c foo -c bar
You provided option -c with argument foo
You provided option -c with argument bar
```

Providing option `-c` that takes an argument without an argument:

```sh
$ sh test_getopts.sh -c
Option -c requires an argument
```

Providing an invalid argument `-e`:

```sh
$ sh test_getopts.sh -e
You provided an invalid option -e
```

### References

- https://www.baeldung.com/linux/grep-exclude-ps-results
- https://stackoverflow.com/questions/46008880/how-to-always-cut-the-pid-from-ps-aux-command
- https://en.wikipedia.org/wiki/Getopts
- https://pubs.opengroup.org/onlinepubs/9699919799/utilities/getopts.html
- https://en.wikipedia.org/wiki/Getopt
- https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap12.html
