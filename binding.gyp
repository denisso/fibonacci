{
	"targets": [
        {
            "target_name": "fibonacciModule",
            "include_dirs" : [
                "src/cc",
                "<!(node -e \"require('nan')\")"
            ],
            "sources": [
                "src/cc/fibonacci.cc"
            ]
        }
    ]
}