# Generated by Django 5.1.5 on 2025-03-18 14:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('gap', '0011_gapanalysis_url'),
    ]

    operations = [
        migrations.RenameField(
            model_name='company',
            old_name='dateRegistered',
            new_name='date_registered',
        ),
        migrations.RenameField(
            model_name='company',
            old_name='numOfAnalysis',
            new_name='num_of_analysis',
        ),
    ]
