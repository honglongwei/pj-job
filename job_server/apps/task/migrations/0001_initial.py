# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-03-14 11:08
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('manage', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Procedure',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('create_user', models.CharField(max_length=40)),
                ('create_time', models.DateTimeField(auto_now_add=True)),
                ('last_user', models.CharField(max_length=40)),
                ('last_time', models.DateTimeField(auto_now=True)),
                ('project_id', models.PositiveIntegerField()),
            ],
            options={
                'db_table': 'procedure',
            },
        ),
        migrations.CreateModel(
            name='ScriptNode',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('args', models.CharField(default=b'', max_length=200)),
                ('index', models.PositiveIntegerField()),
                ('servers', models.TextField()),
                ('script', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='manage.Script')),
            ],
            options={
                'ordering': ['index'],
                'db_table': 'script_node',
            },
        ),
        migrations.CreateModel(
            name='Step',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('index', models.PositiveIntegerField()),
                ('type', models.PositiveSmallIntegerField()),
                ('procedure', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='task.Procedure')),
            ],
            options={
                'ordering': ['index'],
                'db_table': 'step',
            },
        ),
        migrations.AddField(
            model_name='scriptnode',
            name='step',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='task.Step'),
        ),
        migrations.AddField(
            model_name='scriptnode',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='manage.User'),
        ),
    ]
