#!/usr/bin/env python3
"""Restore legacy /upload/ and /wp-content/ assets from the Wayback Machine.

Old posts still reference files that lived on the pre-Hugo viktorpetersson.com
WordPress install. The files are not in this repo. 16 of them are archived
under the OLD domain (viktorpetersson.com, not vpetersson.com) and can be
pulled back; the rest were never captured.

    python3 scripts/restore-legacy-assets.py

Writes into static/, preserving the paths the posts already reference, so no
content changes are needed. Re-running skips files already present.

NOTE: this needs egress to web.archive.org. The metadata API (archive.org) and
the content host (web.archive.org) are different hosts, and some networks reach
one but not the other, in which case every fetch times out.
"""
import json, os, sys, time, urllib.request

# path -> Wayback timestamp, resolved 2026-08-28 against https://viktorpetersson.com
SNAPSHOTS = {
    "/upload/carp-hast-switch": "20150509042150",
    "/upload/esx-carp.diff": "20110505231513",
    "/upload/monit/apache.conf": "20141016075639",
    "/upload/monit/basic.conf": "20141016075314",
    "/upload/monit/postgresql.conf": "20141016080459",
    "/wp-content/uploads/2010/10/VNC-on-Mac-OS-600x478.png": "20101114103825",
    "/wp-content/uploads/2010/12/blotter-calendar-on-leaf-full-600x375.jpg": "20110202103857",
    "/wp-content/uploads/2010/12/group_step1-600x450.jpg": "20110202103941",
    "/wp-content/uploads/2011/01/Blotter-600x475.png": "20110304085313",
    "/wp-content/uploads/2011/05/wireload_net-600x442.png": "20110901135947",
    "/wp-content/uploads/2011/08/encrypt.png": "20110901135951",
    "/wp-content/uploads/2012/08/Time-Machine.png": "20140131151846",
    "/wp-content/uploads/2012/10/gSocial-NEW.jpg": "20140131151846",
    "/wp-content/uploads/2012/10/screenly_pro-600x419.png": "20140131151846",
    "/wp-content/uploads/2013/02/Screenly_OSE_overview-600x432.png": "20131210165508",
}

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")


def main():
    ok = skipped = failed = 0
    for path, ts in sorted(SNAPSHOTS.items()):
        dest = os.path.join(ROOT, "static", path.lstrip("/"))
        if os.path.exists(dest):
            skipped += 1
            continue
        url = f"https://web.archive.org/web/{ts}id_/https://viktorpetersson.com{path}"
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            data = urllib.request.urlopen(req, timeout=60).read()
            if len(data) < 120:
                print(f"  suspiciously small ({len(data)} B), skipping: {path}")
                failed += 1
                continue
            os.makedirs(os.path.dirname(dest), exist_ok=True)
            with open(dest, "wb") as fh:
                fh.write(data)
            print(f"  {len(data):>9,} B  {path}")
            ok += 1
        except Exception as exc:
            print(f"  FAILED {path}: {exc}")
            failed += 1
        time.sleep(0.5)
    print(f"\nrestored {ok}, already present {skipped}, failed {failed}")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
