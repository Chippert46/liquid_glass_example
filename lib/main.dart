import 'dart:ui';

import 'package:flutter/material.dart';

late final FragmentShader shader;

void main() async {
  shader = (await FragmentProgram.fromAsset('shaders/liquidglass.frag')).fragmentShader();
  runApp(ShaderTicker());
}

class ShaderTicker extends StatelessWidget {
  const ShaderTicker({super.key});

  @override
  Widget build(BuildContext context) {
    return Listener(
      onPointerHover: (event) {
        shader.setFloat(2, event.position.dx * window.devicePixelRatio);
        shader.setFloat(3, event.position.dy * window.devicePixelRatio);
        (context as Element).markNeedsBuild();
      },
      child: ImageFiltered(imageFilter: ImageFilter.shader(shader), child: const MyApp()),
    );
  }
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
      ),
      home: const MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

class MyHomePage extends StatelessWidget {
  const MyHomePage({super.key, required this.title});

  final String title;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(backgroundColor: Theme.of(context).colorScheme.inversePrimary, title: Text(title)),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text('a coding presentation. Your willingness to share \nthis knowledge with us is both admirable and \nappreciated', style: Theme.of(context).textTheme.headlineMedium),
            FlutterLogo(size: 50),
          ],
        ),
      ),
    );
  }
}
