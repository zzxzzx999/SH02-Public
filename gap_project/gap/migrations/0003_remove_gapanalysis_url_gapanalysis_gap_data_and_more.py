# Generated by Django 4.2.16 on 2024-11-17 17:41

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("gap", "0002_alter_company_options_alter_gapanalysis_options_and_more"),
    ]

    operations = [
        migrations.RemoveField(model_name="gapanalysis", name="url",),
        migrations.AddField(
            model_name="gapanalysis",
            name="gap_data",
            field=models.JSONField(default=list),
        ),
        migrations.AlterField(
            model_name="gapanalysis",
            name="date",
            field=models.DateField(default=datetime.date(2024, 11, 17)),
        ),
    ]
