<!DOCTYPE html>
<html>

<head>
  <title>Advanced Search Web Part Panel Closer</title>
  <script type="text/javascript">
    (function () {
        var mgAnnounceClosePanel = new CustomEvent('mg-announce-close-panel', { 
            "detail": { 
                "closePanel": true 
            }
        });
        window.parent.dispatchEvent(mgAnnounceClosePanel);
    })();
  </script>
</head>

<body>
    <div style="display: flex">
        <div>
            
        </div>
    </div>
</body>

</html>